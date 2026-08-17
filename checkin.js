/**
 * ==========================================
 * HỆ THỐNG ĐIỂM DANH BẰNG NỤ CƯỜI
 * ==========================================
 *
 * GIỮ NGUYÊN:
 * - Camera
 * - MediaPipe FaceMesh
 * - Giao diện
 * - Hiệu ứng
 * - +1 CCS
 * - LocalStorage
 * - Thông báo thành công
 *
 * ĐÃ SỬA:
 * - Nút bấm hoạt động ổn định
 * - Thuật toán quét miệng dễ nhận diện hơn
 * - Chỉ cần miệng hở/cười là bắt đầu tăng %
 * - Không cười / miệng đóng -> không tăng
 * - Không thấy miệng -> không tăng
 */


/**
 * ==========================================
 * KHỐI 1: BIẾN HỆ THỐNG
 * ==========================================
 */

let cameraMediaStream = null;

let isCheckinRunning = false;

let currentSmilePercent = 0;

let faceMeshDetector = null;

let animationFrameId = null;

let checkinButtonInitialized = false;


/**
 * ==========================================
 * KHỐI 2: KHỞI TẠO NÚT ĐIỂM DANH
 *
 * PHIÊN BẢN ỔN ĐỊNH
 *
 * Không phụ thuộc việc script chạy
 * trước hay sau DOMContentLoaded.
 * ==========================================
 */

function initSmileCheckinButton() {

    if (checkinButtonInitialized) {
        return;
    }


    const btnDiemDanh =
        document.getElementById('btn-diemdanh');


    if (!btnDiemDanh) {

        console.warn(
            '⚠️ Không tìm thấy nút #btn-diemdanh'
        );

        return;
    }


    checkinButtonInitialized = true;


    btnDiemDanh.addEventListener(
        'click',
        function (event) {

            event.preventDefault();

            console.log(
                '✅ Đã bấm nút Bắt đầu Check-in'
            );


            startCleanSmileCheckin();

        }
    );


    console.log(
        '✅ Hệ thống điểm danh nụ cười đã sẵn sàng'
    );
}


/**
 * Nếu HTML đang tải -> chờ DOM.
 *
 * Nếu HTML đã tải xong -> chạy ngay.
 */

if (document.readyState === 'loading') {

    document.addEventListener(
        'DOMContentLoaded',
        initSmileCheckinButton
    );

} else {

    initSmileCheckinButton();
}


/**
 * ==========================================
 * KHỐI 3: HÀM BẮT ĐẦU QUÉT
 * ==========================================
 */

async function startCleanSmileCheckin() {

    console.log(
        '🚀 Bắt đầu hệ thống quét nụ cười...'
    );


    const videoElement =
        document.getElementById('webcam-video');

    const resultDiv =
        document.getElementById('checkin-result');

    const camOverlay =
        document.getElementById('cam-overlay');

    const smileScoreSpan =
        document.getElementById('smile-score');

    const smileProgressBar =
        document.getElementById('smile-progress');


    /**
     * ------------------------------------------
     * KIỂM TRA HTML
     * ------------------------------------------
     */

    if (!videoElement) {

        console.error(
            '❌ Không tìm thấy #webcam-video'
        );

        if (resultDiv) {

            resultDiv.innerHTML = `
                <span class="text-rose-500 font-semibold">
                    ❌ Không tìm thấy khung camera.
                </span>
            `;
        }

        return;
    }


    /**
     * ------------------------------------------
     * NẾU ĐANG CHẠY THÌ KHÔNG CHẠY LẠI
     * ------------------------------------------
     */

    if (isCheckinRunning) {

        console.log(
            '⚠️ Hệ thống đang quét rồi.'
        );

        return;
    }


    /**
     * ------------------------------------------
     * RESET
     * ------------------------------------------
     */

    isCheckinRunning = true;

    currentSmilePercent = 0;


    /**
     * ------------------------------------------
     * DỪNG CAMERA CŨ NẾU CÓ
     * ------------------------------------------
     */

    stopCamera();


    /**
     * ------------------------------------------
     * HIỆN HIỆU ỨNG CHỜ
     * ------------------------------------------
     */

    if (camOverlay) {

        camOverlay.style.display = 'flex';

        camOverlay.innerHTML = `

            <div
                class="
                    flex
                    flex-col
                    items-center
                    justify-center
                    space-y-3
                    p-6
                    bg-slate-950/95
                    rounded-2xl
                    border
                    border-cyan-500/50
                    shadow-2xl
                    animate-fade-in
                "
            >

                <div
                    class="
                        relative
                        flex
                        items-center
                        justify-center
                        w-16
                        h-16
                        rounded-full
                        bg-cyan-500/10
                        border-2
                        border-cyan-400
                    "
                >

                    <i
                        class="
                            fa-solid
                            fa-face-smile
                            text-3xl
                            text-cyan-400
                            animate-bounce
                        "
                    ></i>


                    <div
                        class="
                            absolute
                            inset-0
                            rounded-full
                            border-2
                            border-emerald-400
                            animate-ping
                            opacity-60
                        "
                    ></div>

                </div>


                <p
                    class="
                        text-xs
                        text-cyan-300
                        font-bold
                        uppercase
                        tracking-wider
                    "
                >
                    ✨ Đang khởi chạy hệ thống quét nụ cười...
                </p>


                <p
                    class="
                        text-xs
                        text-slate-300
                        italic
                        text-center
                    "
                >
                    "Hãy chuẩn bị tư thế: Ngồi lùi ra để camera thấy trọn vẹn cả khuôn miệng nhé!"
                </p>


                <div
                    class="
                        w-48
                        h-1.5
                        bg-slate-800
                        rounded-full
                        overflow-hidden
                        relative
                    "
                >

                    <div
                        class="
                            absolute
                            inset-0
                            bg-gradient-to-r
                            from-cyan-400
                            to-emerald-400
                            animate-pulse
                            w-full
                        "
                    ></div>

                </div>

            </div>

        `;
    }


    /**
     * ------------------------------------------
     * ẨN VIDEO TRONG LÚC KHỞI ĐỘNG
     * ------------------------------------------
     */

    videoElement.style.display = 'none';


    /**
     * RESET %
     */

    if (smileScoreSpan) {

        smileScoreSpan.innerText = '0%';
    }


    if (smileProgressBar) {

        smileProgressBar.style.width = '0%';
    }


    /**
     * ------------------------------------------
     * CHỜ HIỆU ỨNG
     * ------------------------------------------
     */

    await new Promise(
        resolve => setTimeout(resolve, 1200)
    );


    /**
     * Nếu người dùng đã dừng trong lúc chờ
     */

    if (!isCheckinRunning) {

        return;
    }


    try {

        /**
         * ======================================
         * KIỂM TRA TRÌNH DUYỆT CÓ CAMERA KHÔNG
         * ======================================
         */

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {

            throw new Error(
                'Trình duyệt không hỗ trợ camera.'
            );
        }


        /**
         * ======================================
         * BẬT CAMERA
         * ======================================
         */

        cameraMediaStream =
            await navigator.mediaDevices.getUserMedia({

                video: {

                    width: {
                        ideal: 640
                    },

                    height: {
                        ideal: 480
                    },

                    facingMode: 'user'

                },

                audio: false

            });


        /**
         * Gắn camera vào video
         */

        videoElement.srcObject =
            cameraMediaStream;


        /**
         * Chờ video sẵn sàng
         */

        await videoElement.play();


        /**
         * --------------------------------------
         * ẨN OVERLAY
         * --------------------------------------
         */

        if (camOverlay) {

            camOverlay.style.display = 'none';

            camOverlay.innerHTML = '';
        }


        videoElement.style.display = 'block';


        /**
         * --------------------------------------
         * THÔNG BÁO
         * --------------------------------------
         */

        if (resultDiv) {

            resultDiv.innerHTML = `

                <span
                    class="
                        text-cyan-400
                        animate-pulse
                        text-xs
                    "
                >
                    ⚡ Đang kết nối AI...
                    Hãy cười và hé miệng nhé!
                </span>

            `;
        }


        /**
         * ======================================
         * KIỂM TRA MEDIAPIPE FACEMESH
         * ======================================
         */

        if (
            typeof FaceMesh === 'undefined'
        ) {

            throw new Error(
                'FaceMesh chưa được tải. Hãy kiểm tra thư viện MediaPipe.'
            );
        }


        /**
         * ======================================
         * KHỞI TẠO FACEMESH
         * ======================================
         */

        faceMeshDetector =
            new FaceMesh({

                locateFile: function(file) {

                    return (
                        'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/' +
                        file
                    );

                }

            });


        /**
         * ======================================
         * CẤU HÌNH FACEMESH
         * ======================================
         */

        faceMeshDetector.setOptions({

            maxNumFaces: 1,

            refineLandmarks: true,

            /**
             * Giảm nhẹ độ khắt khe
             * để dễ nhận diện hơn.
             */

            minDetectionConfidence: 0.65,

            minTrackingConfidence: 0.65

        });


        /**
         * ======================================
         * NHẬN KẾT QUẢ
         * ======================================
         */

        faceMeshDetector.onResults(
            handleCleanSmileResults
        );


        /**
         * ======================================
         * XỬ LÝ FRAME CAMERA
         * ======================================
         */

        let lastTimeProcessed = 0;


        const processFrames =
            async function(timestamp) {

                if (!isCheckinRunning) {

                    return;
                }


                /**
                 * Khoảng 10-12 FPS
                 * đủ cho việc nhận diện miệng.
                 */

                if (
                    timestamp -
                    lastTimeProcessed >
                    90
                ) {

                    if (
                        videoElement &&
                        videoElement.readyState >= 2
                    ) {

                        try {

                            await faceMeshDetector.send({

                                image: videoElement

                            });

                        } catch (meshError) {

                            console.warn(
                                'FaceMesh error:',
                                meshError
                            );

                        }

                    }


                    lastTimeProcessed =
                        timestamp;
                }


                if (isCheckinRunning) {

                    animationFrameId =
                        requestAnimationFrame(
                            processFrames
                        );
                }

            };


        animationFrameId =
            requestAnimationFrame(
                processFrames
            );


        console.log(
            '✅ Camera + FaceMesh đã hoạt động'
        );


    } catch (error) {

        console.error(
            '❌ Lỗi khởi động:',
            error
        );


        isCheckinRunning = false;


        stopCamera();


        if (resultDiv) {

            resultDiv.innerHTML = `

                <span
                    class="
                        text-rose-500
                        font-semibold
                        text-xs
                    "
                >
                    ❌ ${getCameraErrorMessage(error)}
                </span>

            `;
        }


        if (camOverlay) {

            camOverlay.style.display =
                'flex';
        }

    }

}


/**
 * ==========================================
 * KHỐI 4:
 * THUẬT TOÁN QUÉT MIỆNG
 *
 * MỤC TIÊU:
 *
 * 😐 Miệng đóng  -> KHÔNG tăng
 *
 * 🙂 Hơi hé      -> bắt đầu tăng
 *
 * 😄 Cười       -> tăng
 *
 * 😁 Cười to    -> tăng nhanh
 *
 * 100%           -> thành công
 *
 * KHÔNG YÊU CẦU QUÁ KHẮT KHE
 * ==========================================
 */

function handleCleanSmileResults(results) {

    const resultDiv =
        document.getElementById(
            'checkin-result'
        );


    const smileScoreSpan =
        document.getElementById(
            'smile-score'
        );


    const smileProgressBar =
        document.getElementById(
            'smile-progress'
        );


    /**
     * Nếu đã hoàn thành
     */

    if (!isCheckinRunning) {

        return;
    }


    /**
     * ======================================
     * 1. CÓ KHUÔN MẶT KHÔNG?
     * ======================================
     */

    if (
        !results ||
        !results.multiFaceLandmarks ||
        results.multiFaceLandmarks.length === 0
    ) {

        decreaseSmileProgress(
            2
        );


        showSmileMessage(
            '⚠️ Chưa thấy khuôn mặt. Hãy nhìn vào camera.'
        );


        return;
    }


    /**
     * Lấy khuôn mặt đầu tiên
     */

    const landmarks =
        results.multiFaceLandmarks[0];


    /**
     * ======================================
     * 2. LẤY ĐIỂM MIỆNG
     *
     * 13  = môi trên
     * 14  = môi dưới
     * 61  = khóe trái
     * 291 = khóe phải
     * ======================================
     */

    const upperLip =
        landmarks[13];

    const lowerLip =
        landmarks[14];

    const leftCorner =
        landmarks[61];

    const rightCorner =
        landmarks[291];


    /**
     * ======================================
     * 3. PHẢI NHẬN DIỆN ĐƯỢC MIỆNG
     * ======================================
     */

    if (
        !upperLip ||
        !lowerLip ||
        !leftCorner ||
        !rightCorner
    ) {

        decreaseSmileProgress(
            2
        );


        showSmileMessage(
            '⚠️ Chưa nhận diện rõ miệng. Hãy nhìn thẳng camera.'
        );


        return;
    }


    /**
     * ======================================
     * 4. KIỂM TRA MIỆNG CÓ TRONG KHUNG
     *
     * Không quá khắt khe.
     * ======================================
     */

    const mouthVisible =

        upperLip.x >= 0.01 &&
        upperLip.x <= 0.99 &&

        lowerLip.x >= 0.01 &&
        lowerLip.x <= 0.99 &&

        leftCorner.x >= 0.01 &&
        leftCorner.x <= 0.99 &&

        rightCorner.x >= 0.01 &&
        rightCorner.x <= 0.99 &&

        upperLip.y >= 0.05 &&
        upperLip.y <= 0.98 &&

        lowerLip.y >= 0.05 &&
        lowerLip.y <= 0.99;


    if (!mouthVisible) {

        decreaseSmileProgress(
            2
        );


        showSmileMessage(
            '⚠️ Chưa thấy rõ miệng. Hãy chỉnh camera một chút.'
        );


        return;
    }


    /**
     * ======================================
     * 5. TÍNH CHIỀU RỘNG MIỆNG
     * ======================================
     */

    const mouthWidth =
        Math.hypot(

            leftCorner.x -
            rightCorner.x,

            leftCorner.y -
            rightCorner.y

        );


    /**
     * ======================================
     * 6. TÍNH ĐỘ HỞ MIỆNG
     * ======================================
     */

    const mouthOpen =
        Math.hypot(

            upperLip.x -
            lowerLip.x,

            upperLip.y -
            lowerLip.y

        );


    /**
     * ======================================
     * 7. MIỆNG QUÁ NHỎ
     * ======================================
     */

    if (
        mouthWidth <= 0.035
    ) {

        decreaseSmileProgress(
            2
        );


        showSmileMessage(
            '⚠️ Miệng hơi nhỏ trong camera. Hãy tiến gần hơn một chút.'
        );


        return;
    }


    /**
     * ======================================
     * 8. TỶ LỆ HỞ MIỆNG
     *
     * Đây là công thức chính.
     *
     * openRatio =
     * độ mở miệng / chiều rộng miệng
     *
     * ======================================
     */

    const openRatio =
        mouthOpen /
        mouthWidth;


    console.log(
        'Smile:',
        openRatio.toFixed(3),
        'Progress:',
        currentSmilePercent
    );


    /**
     * ======================================
     * 9. NGƯỠNG RẤT DỄ
     *
     * Chỉ cần hở khoảng 10%.
     * ======================================
     */

    const MIN_OPEN_RATIO =
        0.10;


    /**
     * ======================================
     * 10. MIỆNG ĐÓNG
     * ======================================
     */

    if (
        openRatio <
        MIN_OPEN_RATIO
    ) {

        decreaseSmileProgress(
            1
        );


        showSmileMessage(
            '😐 Chưa thấy miệng cười. Hãy hé miệng và cười nhé!'
        );


        return;
    }


    /**
     * ======================================
     * 11. ĐÃ HỞ MIỆNG
     *
     * Càng mở -> tăng càng nhanh.
     * ======================================
     */

    let smileAdd = 0;


    /**
     * Hơi hé
     */

    if (
        openRatio >= 0.10 &&
        openRatio < 0.15
    ) {

        smileAdd = 2;

    }


    /**
     * Hở vừa
     */

    else if (
        openRatio >= 0.15 &&
        openRatio < 0.20
    ) {

        smileAdd = 3;

    }


    /**
     * Cười rõ
     */

    else if (
        openRatio >= 0.20 &&
        openRatio < 0.30
    ) {

        smileAdd = 5;

    }


    /**
     * Cười to
     */

    else if (
        openRatio >= 0.30
    ) {

        smileAdd = 8;

    }


    /**
     * ======================================
     * 12. CỘNG %
     * ======================================
     */

    currentSmilePercent +=
        smileAdd;


    /**
     * Không vượt quá 100
     */

    if (
        currentSmilePercent >
        100
    ) {

        currentSmilePercent =
            100;
    }


    /**
     * ======================================
     * 13. CẬP NHẬT GIAO DIỆN
     * ======================================
     */

    if (smileScoreSpan) {

        smileScoreSpan.innerText =
            currentSmilePercent +
            '%';
    }


    if (smileProgressBar) {

        smileProgressBar.style.width =
            currentSmilePercent +
            '%';
    }


    /**
     * ======================================
     * 14. CHƯA ĐẠT 100%
     * ======================================
     */

    if (
        currentSmilePercent <
        100
    ) {

        showSmileMessage(

            `😄 Đang nhận diện nụ cười (${currentSmilePercent}%) — giữ nụ cười nhé!`

        );


        return;
    }


    /**
     * ======================================
     * 15. ĐẠT 100%
     * ======================================
     */

    if (
        currentSmilePercent >= 100 &&
        isCheckinRunning
    ) {

        /**
         * Tắt trạng thái quét
         */

        isCheckinRunning =
            false;


        /**
         * Dừng animation
         */

        if (
            animationFrameId
        ) {

            cancelAnimationFrame(
                animationFrameId
            );

            animationFrameId =
                null;
        }


        /**
         * Dừng camera
         */

        stopCamera();


        /**
         * Thông báo thành công
         */

        triggerSuccessAndSavePoints();

    }

}


/**
 * ==========================================
 * KHỐI 5:
 * GIẢM % KHI KHÔNG ĐẠT
 * ==========================================
 */

function decreaseSmileProgress(
    amount = 1
) {

    currentSmilePercent =
        Math.max(
            0,
            currentSmilePercent -
            amount
        );


    updateSmileProgress();

}


/**
 * ==========================================
 * CẬP NHẬT THANH %
 * ==========================================
 */

function updateSmileProgress() {

    const smileScoreSpan =
        document.getElementById(
            'smile-score'
        );


    const smileProgressBar =
        document.getElementById(
            'smile-progress'
        );


    if (smileScoreSpan) {

        smileScoreSpan.innerText =
            currentSmilePercent +
            '%';
    }


    if (smileProgressBar) {

        smileProgressBar.style.width =
            currentSmilePercent +
            '%';
    }

}


/**
 * ==========================================
 * HIỆN THÔNG BÁO QUÉT
 * ==========================================
 */

function showSmileMessage(
    message
) {

    const resultDiv =
        document.getElementById(
            'checkin-result'
        );


    if (resultDiv) {

        resultDiv.innerHTML = `

            <span
                class="
                    text-cyan-400
                    text-xs
                    animate-pulse
                "
            >
                ${message}
            </span>

        `;
    }

}


/**
 * ==========================================
 * KHỐI 6:
 * DỪNG CAMERA
 * ==========================================
 */

function stopCamera() {

    /**
     * Dừng animation
     */

    if (
        animationFrameId
    ) {

        cancelAnimationFrame(
            animationFrameId
        );

        animationFrameId =
            null;
    }


    /**
     * Dừng tất cả camera tracks
     */

    if (
        cameraMediaStream
    ) {

        cameraMediaStream
            .getTracks()
            .forEach(
                track => {
                    track.stop();
                }
            );


        cameraMediaStream =
            null;
    }


    /**
     * Xóa srcObject
     */

    const videoElement =
        document.getElementById(
            'webcam-video'
        );


    if (
        videoElement &&
        videoElement.srcObject
    ) {

        videoElement.srcObject =
            null;
    }

}


/**
 * ==========================================
 * KHỐI 7:
 * THÔNG BÁO LỖI CAMERA
 * ==========================================
 */

function getCameraErrorMessage(
    error
) {

    if (!error) {

        return (
            'Không thể khởi động camera.'
        );
    }


    if (
        error.name ===
        'NotAllowedError'
    ) {

        return (
            'Bạn chưa cấp quyền sử dụng camera. Hãy bấm Cho phép (Allow) trên trình duyệt.'
        );
    }


    if (
        error.name ===
        'PermissionDeniedError'
    ) {

        return (
            'Quyền camera đang bị từ chối. Hãy cấp quyền camera cho trang web.'
        );
    }


    if (
        error.name ===
        'NotFoundError'
    ) {

        return (
            'Không tìm thấy camera trên thiết bị.'
        );
    }


    if (
        error.name ===
        'NotReadableError'
    ) {

        return (
            'Camera đang được ứng dụng khác sử dụng.'
        );
    }


    if (
        error.name ===
        'SecurityError'
    ) {

        return (
            'Trình duyệt đang chặn camera vì lý do bảo mật.'
        );
    }


    if (
        error.message
    ) {

        return error.message;
    }


    return (
        'Không thể khởi động camera. Hãy kiểm tra quyền camera.'
    );

}


/**
 * ==========================================
 * KHỐI 8:
 * HÀM KHÓA TIẾN TRÌNH
 * ==========================================
 *
 * Giữ tên hàm này để tương thích
 * với code cũ nếu có phần khác gọi tới.
 * ==========================================
 */

function lockProgressAndWarn(
    warningMessage
) {

    decreaseSmileProgress(
        2
    );


    showSmileMessage(
        warningMessage
    );

}


/**
 * ==========================================
 * KHỐI 9:
 * THÔNG BÁO THÀNH CÔNG + LƯU ĐIỂM
 *
 * GIỮ NGUYÊN LOGIC CODE GỐC
 * ==========================================
 */

function triggerSuccessAndSavePoints() {

    const videoElement =
        document.getElementById(
            'webcam-video'
        );


    const camOverlay =
        document.getElementById(
            'cam-overlay'
        );


    const resultDiv =
        document.getElementById(
            'checkin-result'
        );


    /**
     * --------------------------------------
     * ẨN VIDEO
     * --------------------------------------
     */

    if (videoElement) {

        videoElement.style.display =
            'none';
    }


    /**
     * --------------------------------------
     * HIỆN THÔNG BÁO THÀNH CÔNG
     * --------------------------------------
     */

    if (camOverlay) {

        camOverlay.style.display =
            'flex';


        camOverlay.innerHTML = `

            <div
                class="
                    absolute
                    inset-0
                    bg-slate-950
                    flex
                    flex-col
                    items-center
                    justify-center
                    p-6
                    text-center
                    animate-fade-in
                "
            >

                <div
                    class="
                        w-20
                        h-20
                        rounded-full
                        bg-emerald-500/20
                        border-2
                        border-emerald-400
                        flex
                        items-center
                        justify-center
                        mb-3
                        shadow-[0_0_25px_#34d399]
                    "
                >

                    <i
                        class="
                            fa-solid
                            fa-check
                            text-4xl
                            text-emerald-400
                            animate-bounce
                        "
                    ></i>

                </div>


                <h3
                    class="
                        text-emerald-400
                        font-bold
                        text-lg
                        uppercase
                        tracking-wider
                        mb-1
                    "
                >
                    ĐIỂM DANH THÀNH CÔNG!
                </h3>


                <p
                    class="
                        text-cyan-300
                        text-xs
                        font-mono
                    "
                >
                    +1 CCS đã được chuyển về Hành tinh lớp!
                </p>

            </div>

        `;
    }


    /**
     * --------------------------------------
     * DANH SÁCH LỜI CHÚC
     * --------------------------------------
     */

    const politeAndFunComments = [

        "✨ Nụ cười tỏa nắng chuẩn 'hoa hậu thân thiện'! Hành tinh lớp hôm nay chắc chắn ngập tràn năng lượng tích cực!",

        "🔥 Nụ cười triệu đô thế này làm sao mà các áp lực bài vở dám bén mảng lại gần cơ chứ!",

        "🚀 Thần thái rạng rỡ cấp độ vũ trụ! Thầy cô nhìn thấy nụ cười này chắc chắn sẽ cho điểm 10 tuyệt đối!",

        "👑 Nụ cười đẹp như tranh vẽ! Bạn vừa thắp sáng cả không gian lớp học rồi đấy!",

        "🌟 Tươi tắn, văn minh và đầy sức sống! Chúc bạn một ngày học tập bứt phá và gặt hái thật nhiều điểm 10!"

    ];


    /**
     * Chọn lời chúc ngẫu nhiên
     */

    const selectedComment =
        politeAndFunComments[
            Math.floor(
                Math.random() *
                politeAndFunComments.length
            )
        ];


    /**
     * --------------------------------------
     * HIỆN KẾT QUẢ
     * --------------------------------------
     */

    if (resultDiv) {

        resultDiv.innerHTML = `

            <div
                class="
                    space-y-2
                    p-4
                    bg-slate-900/95
                    rounded-xl
                    border
                    border-emerald-500/60
                    shadow-2xl
                    animate-bounce
                "
            >

                <p
                    class="
                        font-bold
                        text-emerald-400
                        text-sm
                        flex
                        items-center
                        justify-center
                        gap-1.5
                    "
                >

                    <i
                        class="
                            fa-solid
                            fa-circle-check
                        "
                    ></i>

                    Điểm danh nụ cười thành công xuất sắc!

                </p>


                <p
                    class="
                        text-amber-300
                        text-xs
                        italic
                        leading-relaxed
                    "
                >
                    "${selectedComment}"
                </p>


                <p
                    class="
                        text-cyan-300
                        text-xs
                        font-bold
                        tracking-wide
                    "
                >
                    ✨ Đã cộng thành công +1 CCS vào Hành tinh lớp!
                </p>

            </div>

        `;
    }


    /**
     * ======================================
     * LƯU +1 CCS
     * ======================================
     */

    let currentPoints =
        parseInt(
            localStorage.getItem(
                'userPoints'
            )
        );


    if (
        isNaN(currentPoints)
    ) {

        currentPoints =
            1730;
    }


    currentPoints +=
        1;


    localStorage.setItem(
        'userPoints',
        currentPoints
    );


    /**
     * ======================================
     * CẬP NHẬT ĐIỂM HIỂN THỊ
     * ======================================
     */

    const scoreBadge =
        document.querySelector(
            "[class*='Lớp']"
        );


    if (scoreBadge) {

        scoreBadge.textContent =
            `Lớp 11A1 ( ${currentPoints.toLocaleString()} CCS )`;

    }


    /**
     * ======================================
     * CONFETTI
     * ======================================
     */

    if (
        typeof confetti ===
        'function'
    ) {

        confetti({

            particleCount: 220,

            spread: 100,

            origin: {
                y: 0.6
            }

        });

    }


    console.log(
        '🎉 ĐIỂM DSANH THÀNH CÔNG +1 CCS'
    );
    // Gọi hàm cộng điểm tích lũy cá nhân
if (typeof addScore === 'function') {
    addScore(1);
}

}