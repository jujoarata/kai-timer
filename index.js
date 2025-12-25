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

        let classes = 'day';
        if (isToday) classes += ' today';
        if (isPast) classes += ' past';
        if (isSelected) classes += ' selected';
        if (dayOfWeek === 0) classes += ' sunday';
        if (dayOfWeek === 6) classes += ' saturday';

        if (isPast) {
            html += `<div class="${classes}">${day}</div>`;
        } else {
            html += `<div class="${classes}" onclick="selectDate('${dateStr}')">${day}</div>`;
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
