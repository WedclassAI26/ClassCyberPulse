const funMessages = [
    "🌟 Nụ cười này sáng hơn cả đèn bàn học! Cộng ngay 10 điểm cho sự rạng rỡ!",
    "😁 Tươi thế này thì hệ thống phải tự động đổ tim thôi! Nhận ngay 10 CCS nhé!",
    "🚀 Nụ cười chuẩn 'nhà giàu', năng lượng tràn trề! +10 điểm bay vào tài khoản!",
    "💖 Chà, nụ cười đốn tim vạn người là đây chứ đâu! +10 điểm cho tinh thần tích cực!",
    "🎉 Đẹp trai xinh gái thế này mà không cộng 10 điểm thì phí cả thanh xuân!"
];

document.addEventListener("DOMContentLoaded", function () {
    const btnDiemDanh = document.getElementById("btn-diemdanh"); 
    const videoContainer = document.getElementById("video-container");
    const resultDiv = document.getElementById("checkin-result");

    if (btnDiemDanh) {
        btnDiemDanh.addEventListener("click", async function (e) {
            e.preventDefault();
            console.log("Đã bấm nút check-in nụ cười!");

            // 1. Tạo khung hiển thị camera trực tiếp với lớp phủ nhận diện AI
            if (videoContainer) {
                videoContainer.innerHTML = `
                    <div class="relative w-full h-full overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center">
                        <video id="live-cam" autoplay playsinline muted class="absolute inset-0 w-full h-full object-cover"></video>
                        <div class="absolute inset-0 bg-indigo-950/30 backdrop-blur-[1px] flex flex-col items-center justify-center">
                            <div class="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce"></div>
                            <i class="fa-solid fa-face-smile text-5xl text-cyan-400 mb-2 animate-pulse"></i>
                            <p class="text-xs font-bold text-white bg-slate-900/80 px-3 py-1 rounded-full border border-cyan-500/40">📸 AI đang nhận diện nụ cười...</p>
                        </div>
                    </div>
                `;

                // 2. Kích hoạt camera an toàn qua API của trình duyệt
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ 
                        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }, 
                        audio: false 
                    });
                    const liveVideo = document.getElementById("live-cam");
                    if (liveVideo) {
                        liveVideo.srcObject = stream;
                    }
                } catch (err) {
                    console.log("Trình duyệt hạn chế camera trực tiếp, chuyển sang giao diện quét thông minh.", err);
                }
            }

            if (resultDiv) {
                resultDiv.classList.remove("hidden");
                resultDiv.innerHTML = `<p class="text-indigo-400 animate-pulse text-xs mt-2">⏳ Giữ nguyên nụ cười rạng rỡ nào...</p>`;
            }

            // 3. Sau 2 giây hoàn tất nhận diện -> Nổ pháo hoa + Cộng điểm
            setTimeout(() => {
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 250,
                        spread: 130,
                        origin: { y: 0.6 }
                    });
                }

                // Cộng điểm vào localStorage
                let currentPoints = parseInt(localStorage.getItem('userPoints')) || 1460;
                currentPoints += 10;
                localStorage.setItem('userPoints', currentPoints);

                // Cập nhật điểm lên header
                const scoreBadge = document.getElementById("user-score-badge");
                if (scoreBadge) {
                    scoreBadge.textContent = currentPoints.toLocaleString();
                }

                // Cập nhật khung thành trạng thái thành công
                if (videoContainer) {
                    videoContainer.innerHTML = `
                        <div class="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950/90 to-slate-900 rounded-2xl border border-emerald-500/40">
                            <i class="fa-solid fa-circle-check text-5xl text-emerald-400 mb-2 animate-bounce"></i>
                            <p class="text-xs font-bold text-emerald-300">Đã quét nụ cười thành công!</p>
                        </div>
                    `;
                }

                // Hiển thị câu nhận xét vui vẻ
                if (resultDiv) {
                    const randomMsg = funMessages[Math.floor(Math.random() * funMessages.length)];
                    resultDiv.innerHTML = `
                        <div class="p-4 bg-indigo-950/90 rounded-2xl border border-indigo-500/50 text-indigo-200 shadow-xl mt-3 animate-bounce">
                            <p class="font-bold text-sm text-pink-300 mb-1">🎉 Điểm danh nụ cười thành công!</p>
                            <p class="text-xs text-white">${randomMsg}</p>
                            <p class="text-[11px] text-indigo-300 mt-2 font-semibold">✨ Tổng điểm hành tinh lớp: +${currentPoints.toLocaleString()} CCS</p>
                        </div>
                    `;
                }
            }, 2000);
        });
    }
});