function calc() {
    const dateVal = document.getElementById('checkinDate').value;
    if (!dateVal) return;

    const checkin = new Date(dateVal);
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

// 初期化処理
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    today.setDate(today.getDate() + 45);
    document.getElementById('checkinDate').min = new Date().toISOString().split('T')[0];
});
