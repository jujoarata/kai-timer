// 日本の祝日を動的に計算
function getJapaneseHolidays(year) {
    const holidays = {};

    // 固定祝日
    holidays[`${year}-01-01`] = '元日';
    holidays[`${year}-02-11`] = '建国記念の日';
    holidays[`${year}-02-23`] = '天皇誕生日';
    holidays[`${year}-04-29`] = '昭和の日';
    holidays[`${year}-05-03`] = '憲法記念日';
    holidays[`${year}-05-04`] = 'みどりの日';
    holidays[`${year}-05-05`] = 'こどもの日';
    holidays[`${year}-08-11`] = '山の日';
    holidays[`${year}-11-03`] = '文化の日';
    holidays[`${year}-11-23`] = '勤労感謝の日';

    // ハッピーマンデー（第N月曜日）
    holidays[getNthWeekday(year, 1, 1, 2)] = '成人の日'; // 1月第2月曜
    holidays[getNthWeekday(year, 7, 1, 3)] = '海の日'; // 7月第3月曜
    holidays[getNthWeekday(year, 9, 1, 3)] = '敬老の日'; // 9月第3月曜
    holidays[getNthWeekday(year, 10, 1, 2)] = 'スポーツの日'; // 10月第2月曜

    // 春分の日（3月20日または21日）
    const shunbun = getShunbunDate(year);
    holidays[`${year}-03-${String(shunbun).padStart(2, '0')}`] = '春分の日';

    // 秋分の日（9月22日または23日）
    const shubun = getShubunDate(year);
    holidays[`${year}-09-${String(shubun).padStart(2, '0')}`] = '秋分の日';

    // 振替休日の計算（祝日が日曜の場合、翌平日が振替休日）
    const holidayDates = Object.keys(holidays).sort();
    holidayDates.forEach(dateStr => {
        const date = new Date(dateStr);
        if (date.getDay() === 0) { // 日曜日
            let nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            let nextDayStr = formatDate(nextDay);
            while (holidays[nextDayStr]) {
                nextDay.setDate(nextDay.getDate() + 1);
                nextDayStr = formatDate(nextDay);
            }
            holidays[nextDayStr] = '振替休日';
        }
    });

    // 国民の休日（祝日と祝日に挟まれた平日）
    const allDates = Object.keys(holidays).sort();
    for (let i = 0; i < allDates.length - 1; i++) {
        const current = new Date(allDates[i]);
        const next = new Date(allDates[i + 1]);
        const diff = (next - current) / (1000 * 60 * 60 * 24);
        if (diff === 2) {
            const between = new Date(current);
            between.setDate(between.getDate() + 1);
            const betweenStr = formatDate(between);
            if (!holidays[betweenStr] && between.getDay() !== 0) {
                holidays[betweenStr] = '国民の休日';
            }
        }
    }

    return holidays;
}

// 第N週のM曜日を取得
function getNthWeekday(year, month, weekday, n) {
    const firstDay = new Date(year, month - 1, 1);
    let day = 1 + (weekday - firstDay.getDay() + 7) % 7;
    day += (n - 1) * 7;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// 春分の日の計算
function getShunbunDate(year) {
    return Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
}

// 秋分の日の計算
function getShubunDate(year) {
    return Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4));
}

// カレンダーの状態
let currentYear;
let currentMonth;
let selectedDate = null;
let holidayCache = {};

// 初期化
document.addEventListener('DOMContentLoaded', function () {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    renderCalendar();
});

// 祝日キャッシュ取得
function getHolidaysForYear(year) {
    if (!holidayCache[year]) {
        holidayCache[year] = getJapaneseHolidays(year);
    }
    return holidayCache[year];
}

// カレンダー描画
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const monthLabel = document.getElementById('monthLabel');

    monthLabel.textContent = `${currentYear}年${currentMonth + 1}月`;

    const holidays = getHolidaysForYear(currentYear);

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
        const holidayName = holidays[dateStr];

        let classes = 'day';
        if (isToday) classes += ' today';
        if (isPast) classes += ' past';
        if (isSelected) classes += ' selected';
        if (dayOfWeek === 0 || holidayName) classes += ' holiday';
        else if (dayOfWeek === 6) classes += ' saturday';

        const title = holidayName ? `title="${holidayName}"` : '';

        if (isPast) {
            html += `<div class="${classes}" ${title}>${day}</div>`;
        } else {
            html += `<div class="${classes}" ${title} onclick="selectDate('${dateStr}')">${day}</div>`;
        }
    }

    // 常に6行（42セル）になるように空セルを追加
    const totalCells = firstDay + daysInMonth;
    const remainingCells = 42 - totalCells;
    for (let i = 0; i < remainingCells; i++) {
        html += '<div class="day empty"></div>';
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
