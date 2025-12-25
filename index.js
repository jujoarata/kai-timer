// 日本の祝日（2024-2026年）
const holidays = {
    // 2024年
    '2024-01-01': '元日',
    '2024-01-08': '成人の日',
    '2024-02-11': '建国記念の日',
    '2024-02-12': '振替休日',
    '2024-02-23': '天皇誕生日',
    '2024-03-20': '春分の日',
    '2024-04-29': '昭和の日',
    '2024-05-03': '憲法記念日',
    '2024-05-04': 'みどりの日',
    '2024-05-05': 'こどもの日',
    '2024-05-06': '振替休日',
    '2024-07-15': '海の日',
    '2024-08-11': '山の日',
    '2024-08-12': '振替休日',
    '2024-09-16': '敬老の日',
    '2024-09-22': '秋分の日',
    '2024-09-23': '振替休日',
    '2024-10-14': 'スポーツの日',
    '2024-11-03': '文化の日',
    '2024-11-04': '振替休日',
    '2024-11-23': '勤労感謝の日',
    // 2025年
    '2025-01-01': '元日',
    '2025-01-13': '成人の日',
    '2025-02-11': '建国記念の日',
    '2025-02-23': '天皇誕生日',
    '2025-02-24': '振替休日',
    '2025-03-20': '春分の日',
    '2025-04-29': '昭和の日',
    '2025-05-03': '憲法記念日',
    '2025-05-04': 'みどりの日',
    '2025-05-05': 'こどもの日',
    '2025-05-06': '振替休日',
    '2025-07-21': '海の日',
    '2025-08-11': '山の日',
    '2025-09-15': '敬老の日',
    '2025-09-23': '秋分の日',
    '2025-10-13': 'スポーツの日',
    '2025-11-03': '文化の日',
    '2025-11-23': '勤労感謝の日',
    '2025-11-24': '振替休日',
    // 2026年
    '2026-01-01': '元日',
    '2026-01-12': '成人の日',
    '2026-02-11': '建国記念の日',
    '2026-02-23': '天皇誕生日',
    '2026-03-20': '春分の日',
    '2026-04-29': '昭和の日',
    '2026-05-03': '憲法記念日',
    '2026-05-04': 'みどりの日',
    '2026-05-05': 'こどもの日',
    '2026-05-06': '振替休日',
    '2026-07-20': '海の日',
    '2026-08-11': '山の日',
    '2026-09-21': '敬老の日',
    '2026-09-22': '国民の休日',
    '2026-09-23': '秋分の日',
    '2026-10-12': 'スポーツの日',
    '2026-11-03': '文化の日',
    '2026-11-23': '勤労感謝の日',
};

// カレンダーの状態
let currentYear;
let currentMonth;
let selectedDate = null;

// 初期化
document.addEventListener('DOMContentLoaded', function () {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    renderCalendar();
});

// カレンダー描画
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const monthLabel = document.getElementById('monthLabel');

    monthLabel.textContent = `${currentYear}年${currentMonth + 1}月`;

    // カレンダーのヘッダー（曜日）
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    let html = '<div class="calendar-header">';
    weekdays.forEach((day, index) => {
        const cls = index === 0 ? 'sunday' : (index === 6 ? 'saturday' : '');
        html += `<div class="weekday ${cls}">${day}</div>`;
    });
    html += '</div>';

    // 日付グリッド
    html += '<div class="calendar-grid">';

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 前月の空白
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="day empty"></div>';
    }

    // 日付
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dateStr = formatDate(date);
        const isToday = date.getTime() === today.getTime();
        const isPast = date < today;
        const isSelected = selectedDate === dateStr;
        const dayOfWeek = date.getDay();
        const isHoliday = holidays[dateStr];

        let classes = 'day';
        if (isToday) classes += ' today';
        if (isPast) classes += ' past';
        if (isSelected) classes += ' selected';
        if (dayOfWeek === 0 || isHoliday) classes += ' sunday';
        if (dayOfWeek === 6 && !isHoliday) classes += ' saturday';
        if (isHoliday) classes += ' holiday';

        const title = isHoliday ? `title="${isHoliday}"` : '';

        if (isPast) {
            html += `<div class="${classes}" ${title}>${day}</div>`;
        } else {
            html += `<div class="${classes}" ${title} onclick="selectDate('${dateStr}')">${day}</div>`;
        }
    }

    html += '</div>';
    calendar.innerHTML = html;
}

// 日付フォーマット
function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// 月移動
function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// 今月に戻る
function goToToday() {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    renderCalendar();
}

// 日付選択
function selectDate(dateStr) {
    selectedDate = dateStr;
    renderCalendar();
    calc(dateStr);
}

// 計算
function calc(dateStr) {
    const checkin = new Date(dateStr);
    const resDate = new Date(checkin);
    resDate.setDate(checkin.getDate() - 44);

    const y = resDate.getFullYear();
    const m = resDate.getMonth() + 1;
    const d = resDate.getDate();
    const week = ['日', '月', '火', '水', '木', '金', '土'][resDate.getDay()];

    document.getElementById('resDay').innerText = `${y}年${m}月${d}日 (${week})`;
    document.getElementById('resultCard').classList.add('show');

    // カウントダウン計算
    const now = new Date();
    const resStart = new Date(resDate);
    resStart.setHours(0, 0, 0, 0);

    const diff = resStart - now;
    const countdownArea = document.getElementById('countdownArea');
    const countdownValue = document.getElementById('countdownValue');

    if (diff > 0) {
        countdownArea.style.display = 'block';
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        countdownValue.innerText = `あと ${days}日 ${hours}時間`;
    } else if (diff > -24 * 60 * 60 * 1000) {
        countdownArea.style.display = 'block';
        countdownValue.innerText = '🔥 今日から予約開始！';
    } else {
        countdownArea.style.display = 'block';
        countdownValue.innerText = '予約受付中';
    }
}
