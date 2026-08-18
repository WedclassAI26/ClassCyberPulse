// ==========================================
// HỆ THỐNG CHECK-IN NỤ CƯỜI CYBERPULSE (KÈM NÚT DẤU X TẮT LỜI CHÚC)
// ==========================================

let cameraMediaStream = null;
let isCheckinRunning = false;
let currentSmilePercent = 0;
let faceMeshDetector = null;
let animationFrameId = null;
let checkinButtonInitialized = false;

// Khởi tạo nút bấm Check-in
function initSmileCheckinButton() {
    if (checkinButtonInitialized) return;

    const btnDiemDanh = document.getElementById('btn-diemdanh');
    if (!btnDiemDanh) return;

    checkinButtonInitialized = true;

    btnDiemDanh.addEventListener('click', function (event) {
        event.preventDefault();
        startCleanSmileCheckin();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmileCheckinButton);
} else {
    initSmileCheckinButton();
}

// Hàm đóng/tắt khung kết quả lời chúc
window.closeCheckinResult = function() {
    const resultDiv = document.getElementById('checkin-result');
    if (resultDiv) {
        resultDiv.innerHTML = '';
    }
};

// Bắt đầu tiến trình Check-in
async function startCleanSmileCheckin() {
    const videoElement = document.getElementById('webcam-video');
    const resultDiv = document.getElementById('checkin-result');
    const camOverlay = document.getElementById('cam-overlay');
    const smileScoreSpan = document.getElementById('smile-score');
    const smileProgressBar = document.getElementById('smile-progress');

    if (!videoElement) {
        if (resultDiv) {
            resultDiv.innerHTML = `<div class="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-300 text-xs text-center">❌ Không tìm thấy khung camera.</div>`;
        }
        return;
    }

    if (isCheckinRunning) return;

    isCheckinRunning = true;
    currentSmilePercent = 0;

    stopCamera();

    // HIỆU ỨNG OVERLAY TRẠM KHỞI ĐỘNG CYBER
    if (camOverlay) {
        camOverlay.style.display = 'flex';
        camOverlay.className = "absolute inset-0 z-10 flex flex-col items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md rounded-2xl";
        camOverlay.innerHTML = `
            <div class="flex flex-col items-center justify-center space-y-3 p-5 bg-slate-900/90 rounded-2xl border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-fade-in text-center max-w-xs">
                <div class="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-400/50 shadow-lg shadow-cyan-500/20">
                    <i class="fa-solid fa-camera-retro text-2xl text-cyan-400 animate-pulse"></i>
                    <div class="absolute -inset-1 rounded-2xl border border-cyan-400/60 animate-ping opacity-50"></div>
                </div>
                <div>
                    <p class="text-xs text-cyan-300 font-extrabold uppercase tracking-widest">✨ Đang Kích Hoạt AI Camera</p>
                    <p class="text-[10px] text-slate-400 italic mt-1">Ngồi thẳng lưng, nhìn vào camera và chuẩn bị nụ cười tươi nhé!</p>
                </div>
                <div class="w-full h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div class="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 animate-pulse w-full"></div>
                </div>
            </div>
        `;
    }

    videoElement.style.display = 'none';

    if (smileScoreSpan) smileScoreSpan.innerText = '0%';
    if (smileProgressBar) smileProgressBar.style.width = '0%';

    await new Promise(resolve => setTimeout(resolve, 800));

    if (!isCheckinRunning) return;

    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Trình duyệt không hỗ trợ camera.');
        }

        cameraMediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            },
            audio: false
        });

        videoElement.srcObject = cameraMediaStream;
        await videoElement.play();

        // HIỆU ỨNG QUÉT TRONG SUỐT - CAMERA RÕ SÁNG 100%
        if (camOverlay) {
            camOverlay.style.display = 'flex';
            camOverlay.className = "absolute inset-0 z-10 pointer-events-none rounded-2xl overflow-hidden flex flex-col justify-between p-3 bg-transparent";
            camOverlay.innerHTML = `
                <!-- TIA LASER QUÉT CYBERPULSE -->
                <div class="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff] animate-[scan_2s_infinite_linear]"></div>
                
                <!-- TÂM NHẮM MỤC TIÊU TRONG SUỐT -->
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-dashed border-cyan-400/50 rounded-full flex items-center justify-center animate-spin-slow">
                    <div class="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#00f0ff]"></div>
                </div>

                <!-- BẢNG BÁO TRẠNG THÁI AI TRÊN CÙNG -->
                <div class="self-center bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/40 text-[10px] text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg mt-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>AI Scanning...</span>
                </div>
            `;
        }

        videoElement.style.display = 'block';

        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="p-2.5 bg-slate-900/90 border border-cyan-500/40 rounded-xl text-center">
                    <p class="text-xs font-bold text-cyan-300 flex items-center justify-center gap-1.5">
                        <i class="fa-solid fa-wand-magic-sparkles text-amber-400 animate-bounce"></i>
                        <span>Đã kết nối AI! Hãy hé miệng và trao nụ cười rạng rỡ nào!</span>
                    </p>
                </div>
            `;
        }

        if (typeof FaceMesh === 'undefined') {
            throw new Error('FaceMesh chưa được tải. Vui lòng kiểm tra thư viện.');
        }

        faceMeshDetector = new FaceMesh({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        });

        faceMeshDetector.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.65,
            minTrackingConfidence: 0.65
        });

        faceMeshDetector.onResults(handleCleanSmileResults);

        let lastTimeProcessed = 0;
        const processFrames = async (timestamp) => {
            if (!isCheckinRunning) return;

            if (timestamp - lastTimeProcessed > 90) {
                if (videoElement && videoElement.readyState >= 2) {
                    try {
                        await faceMeshDetector.send({ image: videoElement });
                    } catch (meshError) {
                        console.warn('FaceMesh error:', meshError);
                    }
                }
                lastTimeProcessed = timestamp;
            }

            if (isCheckinRunning) {
                animationFrameId = requestAnimationFrame(processFrames);
            }
        };

        animationFrameId = requestAnimationFrame(processFrames);

    } catch (error) {
        isCheckinRunning = false;
        stopCamera();

        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="p-2.5 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-300 text-xs text-center font-semibold">
                    ❌ ${getCameraErrorMessage(error)}
                </div>
            `;
        }

        if (camOverlay) {
            camOverlay.style.display = 'flex';
            camOverlay.className = "absolute inset-0 z-10 flex items-center justify-center p-4 bg-slate-950/90 rounded-2xl";
            camOverlay.innerHTML = '';
        }
    }
}

// THUẬT TOÁN QUÉT NỤ CƯỜI (GIỮ NGUYÊN 100%)
function handleCleanSmileResults(results) {
    if (!isCheckinRunning) return;

    if (!results || !results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
        decreaseSmileProgress(2);
        showSmileMessage('👀 Chưa thấy khuôn mặt. Hãy nhìn vào giữa khung camera nhé!');
        return;
    }

    const landmarks = results.multiFaceLandmarks[0];
    const upperLip = landmarks[13];
    const lowerLip = landmarks[14];
    const leftCorner = landmarks[61];
    const rightCorner = landmarks[291];

    if (!upperLip || !lowerLip || !leftCorner || !rightCorner) {
        decreaseSmileProgress(2);
        showSmileMessage('🔍 Đang căn chỉnh... Giữ nguyên vị trí giúp mình nhé!');
        return;
    }

    const mouthWidth = Math.hypot(leftCorner.x - rightCorner.x, leftCorner.y - rightCorner.y);
    const mouthOpen = Math.hypot(upperLip.x - lowerLip.x, upperLip.y - lowerLip.y);

    if (mouthWidth <= 0.035) {
        decreaseSmileProgress(2);
        showSmileMessage('📏 Tiến lại gần hơn một chút để camera thấy rõ nụ cười nhé!');
        return;
    }

    const openRatio = mouthOpen / mouthWidth;

    if (openRatio < 0.10) {
        decreaseSmileProgress(1);
        showSmileMessage('😐 Chưa thấy nụ cười. Mỉm cười hoặc tươi lên một chút nào!');
        return;
    }

    let smileAdd = 0;
    let statusText = '';

    if (openRatio >= 0.10 && openRatio < 0.15) {
        smileAdd = 2;
        statusText = '🙂 Tươi lắm! Mở rộng nụ cười hơn nữa nào...';
    } else if (openRatio >= 0.15 && openRatio < 0.20) {
        smileAdd = 4;
        statusText = '😄 Nụ cười rạng rỡ chuẩn Gen Z! Giữ nguyên nhé!';
    } else if (openRatio >= 0.20 && openRatio < 0.30) {
        smileAdd = 6;
        statusText = '🔥 Tuyệt vời! Năng lượng tỏa sáng bùng nổ!';
    } else if (openRatio >= 0.30) {
        smileAdd = 9;
        statusText = '🌟 Nụ cười Siêu Vũ Trụ! Đang cộng điểm cực nhanh!';
    }

    currentSmilePercent = Math.min(100, currentSmilePercent + smileAdd);
    updateSmileProgress();

    if (currentSmilePercent < 100) {
        showSmileMessage(`${statusText} (${currentSmilePercent}%)`);
        return;
    }

    if (currentSmilePercent >= 100 && isCheckinRunning) {
        isCheckinRunning = false;

        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        stopCamera();
        triggerSuccessAndSavePoints();
    }
}

function decreaseSmileProgress(amount = 1) {
    currentSmilePercent = Math.max(0, currentSmilePercent - amount);
    updateSmileProgress();
}

function updateSmileProgress() {
    const smileScoreSpan = document.getElementById('smile-score');
    const smileProgressBar = document.getElementById('smile-progress');

    if (smileScoreSpan) smileScoreSpan.innerText = `${currentSmilePercent}%`;
    if (smileProgressBar) smileProgressBar.style.width = `${currentSmilePercent}%`;
}

function showSmileMessage(message) {
    const resultDiv = document.getElementById('checkin-result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="p-2.5 bg-slate-900/90 border border-cyan-500/40 rounded-xl text-center">
                <span class="text-cyan-300 text-xs font-semibold animate-pulse">${message}</span>
            </div>
        `;
    }
}

function stopCamera() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    if (cameraMediaStream) {
        cameraMediaStream.getTracks().forEach(track => track.stop());
        cameraMediaStream = null;
    }

    const videoElement = document.getElementById('webcam-video');
    if (videoElement && videoElement.srcObject) {
        videoElement.srcObject = null;
    }
}

function getCameraErrorMessage(error) {
    if (!error) return 'Không thể khởi động camera.';
    if (error.name === 'NotAllowedError') return 'Bạn chưa cấp quyền sử dụng camera. Hãy nhấn "Cho phép" nhé!';
    if (error.name === 'NotFoundError') return 'Không tìm thấy camera trên thiết bị.';
    if (error.name === 'NotReadableError') return 'Camera đang được ứng dụng khác sử dụng.';
    return error.message || 'Không thể mở camera.';
}

function lockProgressAndWarn(warningMessage) {
    decreaseSmileProgress(2);
    showSmileMessage(warningMessage);
}

// BÙNG NỔ PHÁO HOA & KHUNG THÔNG BÁO VỪA VẶN CÓ DẤU X ĐÓNG
function triggerSuccessAndSavePoints() {
    const videoElement = document.getElementById('webcam-video');
    const camOverlay = document.getElementById('cam-overlay');
    const resultDiv = document.getElementById('checkin-result');

    if (videoElement) videoElement.style.display = 'none';

    // HIỆU ỨNG TRÊN KHUNG CAMERA
    if (camOverlay) {
        camOverlay.style.display = 'flex';
        camOverlay.className = "absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center animate-fade-in space-y-2 bg-slate-950/95 rounded-2xl";
        camOverlay.innerHTML = `
            <div class="relative w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-[0_0_35px_rgba(52,211,153,0.8)] animate-bounce">
                <i class="fa-solid fa-crown text-3xl text-amber-300"></i>
                <div class="absolute -inset-1.5 rounded-full border border-emerald-400/60 animate-ping"></div>
            </div>
            <div>
                <h3 class="text-emerald-400 font-black text-xl uppercase tracking-wider">CHECK-IN HOÀN HẢO!</h3>
                <p class="text-cyan-300 text-[11px] font-mono mt-0.5">✨ Tỏa sáng năng lượng tích cực!</p>
            </div>
        `;
    }

    const politeAndFunComments = [
        "✨ Nụ cười tỏa nắng chuẩn 'hoa hậu thân thiện'! Hôm nay chắc chắn là một ngày bùng nổ!",
        "🔥 Nụ cười triệu đô thế này làm sao mà áp lực học tập dám bén mảng lại gần!",
        "🚀 Thần thái rạng rỡ cấp độ vũ trụ! Thầy cô nhìn thấy nụ cười này chắc chắn cộng ngay 10 điểm!",
        "👑 Nụ cười đẹp như tranh vẽ! Bạn vừa thắp sáng cả không gian lớp học rồi đấy!",
        "🌟 Tươi tắn, văn minh và tràn đầy sức sống! Chúc bạn gặt hái thật nhiều thành công!"
    ];

    const selectedComment = politeAndFunComments[Math.floor(Math.random() * politeAndFunComments.length)];

    // KHUNG THÔNG BÁO CÓ NÚT DẤU X Ở GÓC TRÊN BÊN PHẢI
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="animate-fly-down space-y-2 p-3.5 pr-8 bg-gradient-to-r from-emerald-950/95 via-slate-900/95 to-cyan-950/95 rounded-xl border-2 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.4)] backdrop-blur-xl relative overflow-hidden text-center">
                
                <!-- NÚT DẤU X TẮT LỜI CHÚC -->
                <button onclick="window.closeCheckinResult()" class="absolute top-2 right-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 rounded-lg w-6 h-6 flex items-center justify-center transition-all cursor-pointer z-20" title="Tắt lời chúc">
                    <i class="fa-solid fa-xmark text-xs"></i>
                </button>

                <!-- VỆT SÁNG CÔNG NGHỆ -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>

                <!-- HUY HIỆU CHECK-IN -->
                <div class="flex items-center justify-center gap-2">
                    <span class="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-widest shadow-md animate-pulse">
                        ⭐ CHECK-IN THÀNH CÔNG
                    </span>
                    <span class="bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                        ✨ +1 CCS
                    </span>
                </div>

                <!-- TIÊU ĐỀ LỜI CHÚC -->
                <h3 class="font-black text-emerald-300 text-sm flex items-center justify-center gap-1.5 tracking-wide">
                    <i class="fa-solid fa-circle-check text-emerald-400 text-base animate-bounce"></i>
                    <span>NỤ CƯỜI RẠNG RỠ VŨ TRỤ!</span>
                </h3>

                <!-- LỜI CHÚC TRUYỀN CẢM HƯỚNG GỌN GÀNG -->
                <div class="text-amber-200 text-xs italic leading-snug font-semibold bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 shadow-inner">
                    "${selectedComment}"
                </div>

                <!-- THÔNG BÁO CỘNG ĐIỂM -->
                <p class="text-cyan-300 text-[11px] font-bold tracking-wide">
                    🚀 Điểm thưởng đã được gửi trực tiếp về Hành tinh lớp!
                </p>
            </div>
        `;

        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // BẮN PHÁO HOA TỎA RỘNG
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 180,
            spread: 140,
            startVelocity: 55,
            origin: { y: 0.6 },
            shapes: ['star', 'circle'],
            colors: ['#00f0ff', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#fbbf24']
        });

        setTimeout(() => {
            confetti({
                particleCount: 90,
                angle: 60,
                spread: 90,
                origin: { x: 0, y: 0.75 },
                colors: ['#00f0ff', '#10b981', '#fbbf24']
            });
        }, 200);

        setTimeout(() => {
            confetti({
                particleCount: 90,
                angle: 120,
                spread: 90,
                origin: { x: 1, y: 0.75 },
                colors: ['#ec4899', '#10b981', '#00f0ff']
            });
        }, 400);
    }

    // LƯU ĐIỂM VÀO LOCALSTORAGE
    let currentPoints = parseInt(localStorage.getItem('userPoints')) || 1730;
    currentPoints += 1;
    localStorage.setItem('userPoints', currentPoints);

    const scoreBadge = document.querySelector("[class*='Lớp']");
    if (scoreBadge) {
        scoreBadge.textContent = `Lớp 11A1 ( ${currentPoints.toLocaleString()} CCS )`;
    }

    // TÍCH LŨY VÀO TÀI KHOẢN CÁ NHÂN
    if (typeof addScore === 'function') {
        addScore(1);
    }
}