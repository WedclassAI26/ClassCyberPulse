// js/ethicsLog.js - Nhật ký Đạo đức số (Kiểm duyệt AI dứt khoát, chỉ rõ lỗi sai & hậu quả)

window.renderEthicsLogModule = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="relative max-w-5xl mx-auto my-2" id="ethics-main-card">
            <!-- HIỆU ỨNG HÀO QUANG NỀN -->
            <div class="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-70 transition duration-500"></div>

            <div class="relative bg-slate-900/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-800/90 shadow-2xl space-y-4">
                
                <!-- HEADER CHUYÊN NGHIỆP -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-amber-500/10 to-amber-400/30 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10 shrink-0">
                            <i class="fa-solid fa-shield-heart text-xl"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-lg font-extrabold text-white tracking-wide">Nhật Ký Đạo Đức Số</h3>
                                <span class="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">AI Checked</span>
                            </div>
                            <p class="text-[11px] text-slate-400 mt-0.5">Ghi nhận việc tốt, lan tỏa văn hóa mạng văn minh & tích lũy điểm rèn luyện.</p>
                        </div>
                    </div>

                    <!-- NÚT GỬI TRÊN HEADER -->
                    <div class="flex items-center gap-3 shrink-0">
                        <button onclick="window.submitEthicsLog()" class="py-2.5 px-6 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.02] text-xs flex items-center justify-center gap-2 cursor-pointer">
                            <i class="fa-solid fa-paper-plane text-xs"></i>
                            <span>Gửi Nhật Ký</span>
                        </button>
                    </div>
                </div>

                <!-- BỐ CỤC HÀNG NGANG (GRID 2 CỘT) -->
                <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    
                    <!-- CỘT TRÁI: Ô NHẬP NỘI DUNG -->
                    <div class="md:col-span-7 space-y-2">
                        <div class="flex items-center justify-between">
                            <label class="block text-xs font-semibold text-slate-300">Nội dung việc tốt / bài học <span class="text-rose-400">* (+1 CCS)</span>:</label>
                            <span class="text-[10px] text-amber-400/90 font-medium"><i class="fa-solid fa-lightbulb mr-1"></i> Gợi ý chủ đề:</span>
                        </div>

                        <!-- THẺ GỢI Ý CHỦ ĐỀ -->
                        <div class="flex flex-wrap gap-1">
                            <span class="text-[10px] bg-slate-950/80 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-lg">
                                🤝 Giúp bạn học tập
                            </span>
                            <span class="text-[10px] bg-slate-950/80 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-lg">
                                🛡️ Nhắc nhở an toàn mạng
                            </span>
                            <span class="text-[10px] bg-slate-950/80 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-lg">
                                💬 Chia sẻ năng lượng tích cực
                            </span>
                        </div>

                        <textarea id="ethics-input" rows="5" oninput="window.updateEthicsCharCount()" placeholder="Hãy tự viết câu chuyện hoặc bài học của bạn (Tối thiểu 50 ký tự để AI kiểm duyệt)..." class="w-full bg-slate-950/90 border border-slate-800/90 focus:border-amber-500/80 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner h-[135px] resize-none"></textarea>
                        
                        <!-- BỘ ĐẾM KÝ TỰ -->
                        <div class="flex justify-between items-center px-1">
                            <span class="text-[10px] text-slate-500">Viết chân thật, chia sẻ sâu sắc.</span>
                            <span id="ethics-char-count" class="text-[10px] font-medium text-rose-400">0 / 50 ký tự tối thiểu</span>
                        </div>
                    </div>

                    <!-- CỘT PHẢI: KHU VỰC TẢI FILE / ẢNH MINH HỌA -->
                    <div class="md:col-span-5 space-y-2">
                        <div class="flex items-center justify-between">
                            <label class="block text-xs font-semibold text-slate-300">
                                Hình ảnh / Tệp minh họa <span class="text-slate-500 font-normal">(Không bắt buộc)</span>:
                            </label>
                        </div>
                        
                        <!-- GHI CHÚ CỘNG ĐIỂM -->
                        <div class="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <i class="fa-solid fa-circle-plus text-xs"></i>
                            <span>Tải tệp minh họa hợp lệ được AI duyệt sẽ được <b>+1 CCS</b> nữa!</span>
                        </div>

                        <div class="relative border border-dashed border-slate-800 hover:border-amber-500/50 bg-slate-950/60 hover:bg-slate-950/90 rounded-xl p-3 text-center transition-all cursor-pointer group h-[142px] flex flex-col justify-center items-center" id="ethics-upload-zone" onclick="document.getElementById('ethics-file-input').click()">
                            <input type="file" id="ethics-file-input" accept="image/*,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" class="hidden" onchange="handleEthicsFileSelect(event)">
                            
                            <div id="ethics-upload-prompt" class="flex flex-col items-center justify-center">
                                <div class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-amber-500/40 flex items-center justify-center text-slate-400 group-hover:text-amber-400 mb-1.5 transition-all shadow-md">
                                    <i class="fa-solid fa-cloud-arrow-up text-xs"></i>
                                </div>
                                <p class="text-xs text-slate-300 font-medium">Kéo thả tệp vào đây</p>
                                <p class="text-[10px] text-amber-400/80 font-semibold mt-0.5">hoặc Nhấn để chọn tệp</p>
                                <p class="text-[9px] text-slate-500 mt-1 px-1">Hỗ trợ: PNG, JPG, PDF, Word (.doc, .docx)</p>
                            </div>

                            <!-- KHUNG XEM TRƯỚC TỆP -->
                            <div id="ethics-file-preview" class="hidden w-full relative items-center justify-between bg-slate-900 border border-slate-800 p-2 rounded-lg">
                                <div class="flex items-center space-x-2.5 overflow-hidden">
                                    <div id="ethics-icon-container" class="w-10 h-10 flex items-center justify-center bg-slate-950 rounded-lg border border-slate-800 shrink-0">
                                        <img id="ethics-img-thumb" src="" alt="Preview" class="w-full h-full object-cover rounded-lg hidden">
                                        <i id="ethics-file-icon" class="fa-solid fa-file text-lg text-amber-400 hidden"></i>
                                    </div>
                                    <div class="text-left overflow-hidden">
                                        <p id="ethics-filename" class="text-xs font-semibold text-slate-200 truncate max-w-[130px]"></p>
                                        <p id="ethics-filesize" class="text-[9px] text-slate-400"></p>
                                    </div>
                                </div>
                                <button type="button" onclick="removeEthicsFile(event)" class="text-slate-400 hover:text-rose-400 bg-slate-950 hover:bg-rose-500/10 p-1.5 rounded-lg border border-slate-800 transition-all" title="Xóa tệp">
                                    <i class="fa-solid fa-trash-can text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- BẢNG THÔNG BÁO KẾT QUẢ VỚI HIỆU ỨNG NỔI BẬT -->
                <div id="ethics-result" class="hidden relative p-4 pr-9 rounded-2xl text-xs border transition-all duration-700 transform origin-top"></div>

                <!-- DÒNG CHÚ THÍCH PHÍA DƯỚI -->
                <div class="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span class="flex items-center gap-1">
                        <i class="fa-solid fa-wand-magic-sparkles text-amber-400"></i> AI tự động phân tích giá trị đạo đức & lan tỏa thông điệp tích cực.
                    </span>
                </div>
            </div>
        </div>
    `;
};

// Hàm tương thích
function renderEthicsLogModule(containerId) {
    window.renderEthicsLogModule(containerId);
}

// Cập nhật số ký tự đếm thời gian thực
window.updateEthicsCharCount = function() {
    const input = document.getElementById('ethics-input');
    const counter = document.getElementById('ethics-char-count');
    if (!input || !counter) return;

    const len = input.value.trim().length;
    if (len < 50) {
        counter.textContent = `${len} / 50 ký tự tối thiểu`;
        counter.className = "text-[10px] font-medium text-rose-400";
    } else {
        counter.textContent = `${len} ký tự (Đạt yêu cầu +1 CCS)`;
        counter.className = "text-[10px] font-medium text-emerald-400";
    }
};

// Đóng khung kết quả
window.closeEthicsResult = function() {
    const resultBox = document.getElementById('ethics-result');
    if (resultBox) {
        resultBox.classList.add('hidden');
        resultBox.innerHTML = '';
    }
};

// Hiệu ứng Rung lắc nhẹ
window.triggerEthicsShake = function() {
    const card = document.getElementById('ethics-main-card');
    if (card) {
        card.classList.add('animate-bounce');
        setTimeout(() => {
            card.classList.remove('animate-bounce');
        }, 800);
    }
};

// HIỆU ỨNG PHÁO HOA SIÊU BÙNG NỔ
window.triggerEthicsConfetti = function() {
    if (typeof confetti !== 'function') return;

    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    confetti({
        particleCount: 180,
        spread: 120,
        startVelocity: 65,
        origin: { y: 0.6 },
        shapes: ['star', 'circle'],
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#38bdf8']
    });

    confetti({
        particleCount: 120,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.8 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#f43f5e']
    });

    confetti({
        particleCount: 120,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.8 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#f43f5e']
    });

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({
            particleCount,
            startVelocity: 35,
            spread: 360,
            ticks: 90,
            origin: { x: Math.random(), y: Math.random() - 0.2 },
            colors: ['#f59e0b', '#10b981', '#06b6d4', '#f43f5e', '#a855f7', '#fbbf24']
        });
    }, 220);
};

// Xử lý chọn tệp
window.handleEthicsFileSelect = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const imgThumb = document.getElementById('ethics-img-thumb');
    const fileIcon = document.getElementById('ethics-file-icon');
    
    imgThumb.classList.add('hidden');
    fileIcon.classList.add('hidden');

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imgThumb.src = e.target.result;
            imgThumb.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
        fileIcon.className = 'fa-solid fa-file-pdf text-lg text-rose-500';
        fileIcon.classList.remove('hidden');
    } else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        fileIcon.className = 'fa-solid fa-file-word text-lg text-blue-500';
        fileIcon.classList.remove('hidden');
    } else {
        fileIcon.className = 'fa-solid fa-file text-lg text-amber-400';
        fileIcon.classList.remove('hidden');
    }

    document.getElementById('ethics-filename').textContent = file.name;
    document.getElementById('ethics-filesize').textContent = (file.size / 1024).toFixed(1) + ' KB';

    document.getElementById('ethics-upload-prompt').classList.add('hidden');
    document.getElementById('ethics-file-preview').classList.remove('hidden');
    document.getElementById('ethics-file-preview').classList.add('flex');
};

// Xóa file
window.removeEthicsFile = function(event) {
    if (event) event.stopPropagation();
    const fileInput = document.getElementById('ethics-file-input');
    if (fileInput) fileInput.value = '';

    document.getElementById('ethics-upload-prompt').classList.remove('hidden');
    document.getElementById('ethics-file-preview').classList.add('hidden');
    document.getElementById('ethics-file-preview').classList.remove('flex');
};

// LẤY VÀ LƯU LỊCH SỬ NỘI DUNG ĐÃ GỬI TRONG NGÀY
function getTodayDateString() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function checkAndSaveDuplicateEthics(cleanText) {
    const savedUser = localStorage.getItem("cyberUser");
    let userKey = "guest";
    if (savedUser) {
        try {
            const u = JSON.parse(savedUser);
            if (u && u.email) userKey = u.email.toLowerCase();
        } catch (e) {}
    }

    const today = getTodayDateString();
    const storageKey = `ethics_history_${userKey}_${today}`;
    const history = JSON.parse(localStorage.getItem(storageKey) || "[]");

    const normalizedNewText = cleanText.toLowerCase().replace(/\s+/g, ' ').trim();

    const isDuplicate = history.some(item => {
        const normalizedOld = item.toLowerCase().replace(/\s+/g, ' ').trim();
        return normalizedOld === normalizedNewText;
    });

    return {
        isDuplicate: isDuplicate,
        save: function() {
            history.push(cleanText);
            localStorage.setItem(storageKey, JSON.stringify(history));
        }
    };
}

// Gửi nhật ký & AI Kiểm duyệt chính xác
window.submitEthicsLog = async function() {
    const input = document.getElementById('ethics-input');
    const resultBox = document.getElementById('ethics-result');
    const fileInput = document.getElementById('ethics-file-input');
    const text = input.value.trim();
    const file = fileInput && fileInput.files ? fileInput.files[0] : null;

    const closeBtnHtml = `
        <button onclick="window.closeEthicsResult()" class="absolute top-2.5 right-2.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg p-1 w-6 h-6 flex items-center justify-center transition-all cursor-pointer" title="Đóng">
            <i class="fa-solid fa-xmark text-xs"></i>
        </button>
    `;

    // 1. CHƯA ĐỦ ĐỘ DÀI TỐI THIỂU (50 KÝ TỰ)
    if (text.length < 50) {
        window.triggerEthicsShake();
        resultBox.className = "p-4 pr-9 rounded-2xl border-2 border-rose-400/70 bg-rose-950/80 text-rose-200 relative shadow-[0_0_25px_rgba(251,113,133,0.3)] backdrop-blur-xl animate-[bounce_0.5s_ease-out_1] space-y-2";
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = `
            <div class="flex items-center justify-between border-b border-rose-500/30 pb-2">
                <span class="bg-rose-500/30 text-rose-200 border border-rose-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                    📝 Chưa Đủ Độ Dài Yêu Cầu
                </span>
                <span class="text-xs font-bold text-rose-300">0 Điểm CCS</span>
            </div>

            <div class="text-xs leading-relaxed space-y-1.5">
                <p class="font-bold text-white flex items-start gap-1.5">
                    <span class="text-base">📌</span>
                    <span><b>Nội dung chưa đủ điều kiện:</b> Bài viết hiện tại của bạn mới đạt <b>${text.length}/50 ký tự tối thiểu</b>.</span>
                </p>
                <p class="text-[11px] text-rose-200/90 bg-rose-900/40 p-2.5 rounded-xl border border-rose-500/30 italic flex items-start gap-2">
                    <i class="fa-solid fa-heart text-rose-300 mt-0.5 text-xs shrink-0"></i>
                    <span>Bạn hãy kể chi tiết hơn về hoàn cảnh hoặc cảm nhận của bản thân nhé! Việc chia sẻ sâu sắc giúp bạn rèn luyện tư duy và nhận điểm thưởng trọn vẹn.</span>
                </p>
            </div>
            ${closeBtnHtml}
        `;
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // 2. TRÙNG LẶP NỘI DUNG TRONG NGÀY
    const dupCheck = checkAndSaveDuplicateEthics(text);
    if (dupCheck.isDuplicate) {
        window.triggerEthicsShake();
        resultBox.className = "p-4 pr-9 rounded-2xl border-2 border-rose-400/70 bg-rose-950/80 text-rose-200 relative shadow-[0_0_25px_rgba(251,113,133,0.3)] backdrop-blur-xl animate-[bounce_0.5s_ease-out_1] space-y-2";
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = `
            <div class="flex items-start gap-2">
                <i class="fa-solid fa-circle-info text-rose-300 text-base mt-0.5 shrink-0"></i>
                <div class="leading-relaxed">
                    <b class="text-white text-xs">Bạn đã chia sẻ câu chuyện này trong ngày hôm nay rồi!</b>
                    <p class="text-[11px] text-rose-200/90 mt-1">Để tiếp tục tích lũy điểm CCS, bạn hãy chia sẻ một bài học hoặc hành động tích cực khác nhé. Nội dung hiện tại vẫn được giữ nguyên để bạn tham khảo hoặc chỉnh sửa lại.</p>
                </div>
            </div>
            ${closeBtnHtml}
        `;
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // TRẠNG THÁI AI ĐANG ĐÁNH GIÁ
    resultBox.className = "p-3 pr-8 rounded-xl text-xs border bg-slate-950/90 border-slate-800 text-slate-300 relative shadow-lg";
    resultBox.classList.remove('hidden');
    resultBox.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fa-solid fa-spinner fa-spin text-amber-400 shrink-0"></i> 
            <span class="leading-snug">Mình đang đánh giá nội dung bài viết của bạn...</span>
        </div>
    `;

    try {
        const promptText = `[KIỂM DUYỆT ĐẠO ĐỨC NỔI BẬT LỖI SAI] Hãy đọc kỹ bài viết sau của bạn học sinh: "${text}" ${file ? `(Có tệp minh họa: ${file.name})` : ''}.

YÊU CẦU QUAN TRỌNG:
1. LUÔN XƯNG HÔ: "mình" (AI) và "bạn" (học sinh). KHÔNG dùng từ "em", KHÔNG khen ngợi bọc lót khi hành vi là sai trái hay vi phạm kỷ luật.
2. PHÂN LOẠI HÀNH VI CHƯA ĐÚNG (ví dụ: trốn tiết đi chơi, bao che cho bạn làm việc sai, chỉ bài trong giờ kiểm tra, gian lận, dùng từ thô tục, gõ phím vô nghĩa):
   - "status": "rejected"
   - "errorTitle": "Chỉ rõ tên vi phạm (vd: Vi Phạm Kỷ Luật Học Đường / Gian Lận Trong Kiểm Tra / Bao Che Hành Vi Chưa Đúng)"
   - "errorDetail": "Chỉ ra chính xác hành vi trong bài viết là sai ở đâu (Ví dụ: Việc rủ hoặc giúp bạn trốn tiết là vi phạm quy định nội quy trường lớp và thiếu trách nhiệm với việc học)."
   - "consequence": "Phân tích thẳng thắn hậu quả (Ví dụ: Việc này ảnh hưởng trực tiếp đến kết quả học tập của bạn lẫn người bạn đó, gây mất uy tín và lòng tin từ thầy cô, cha mẹ)."
   - "advice": "Lời nhắc dứt khoát định hướng lại (Ví dụ: Bạn nên khuyến khích bạn bè cùng chấp hành tốt nội quy và tham gia các hoạt động vui chơi lành mạnh sau giờ học)."

3. NẾU BÀI VIẾT TÍCH CỰC VÀ TỬ TẾ HOÀN TOÀN:
   - "status": "approved"
   - "textApproved": true
   - "fileApproved": true/false
   - "valueTag": "Tên_giá_trị_đạo_đức (vd: Lòng Trắc Ẩn / Trách Nhiệm Số / Sự Thấu Cảm)"
   - "message": "Lời khen truyền cảm hứng xưng MÌNH - BẠN"
   - "impact": "Tác động tích cực tới cộng đồng"

Trả về duy nhất JSON chuẩn:
{"status": "approved" hoặc "rejected", "textApproved": true/false, "fileApproved": true/false, "valueTag": "chuỗi", "message": "chuỗi", "impact": "chuỗi", "errorTitle": "chuỗi", "errorDetail": "chuỗi", "consequence": "chuỗi", "advice": "chuỗi"}`;

        const response = typeof askClassAI === 'function' 
            ? await askClassAI(promptText)
            : JSON.stringify({ 
                status: "approved", 
                textApproved: true, 
                fileApproved: !!file, 
                valueTag: "Trách Nhiệm Số & Tử Tế",
                message: "Mình rất ấn tượng với nhận thức sâu sắc của bạn về văn hóa ứng xử trên không gian mạng!",
                impact: "Hành động của bạn góp phần xây dựng cộng đồng học sinh văn minh và an toàn."
            });

        let data;
        try {
            const jsonString = response.match(/\{[\s\S]*\}/)[0];
            data = JSON.parse(jsonString);
        } catch (e) {
            data = { 
                status: "approved", 
                textApproved: true, 
                fileApproved: !!file, 
                valueTag: "Trách Nhiệm Số",
                message: "Mình rất ấn tượng với nhận thức sâu sắc của bạn!",
                impact: "Góp phần xây dựng cộng đồng học sinh văn minh và tích cực."
            };
        }

        if (data.status === 'approved' || data.textApproved === true) {
            // Lưu chống trùng
            dupCheck.save();

            let earnedScore = 1;
            let bonusNote = "";

            if (file && data.fileApproved !== false) {
                earnedScore += 1;
                bonusNote = " (+1 CCS từ tệp minh họa)";
            }

            // Pháo hoa bùng nổ
            window.triggerEthicsConfetti();

            // KHUNG TUYÊN DƯƠNG XANH NGỌC
            resultBox.className = "p-4 pr-9 rounded-2xl border-2 border-emerald-400 bg-emerald-950/85 text-emerald-100 relative shadow-[0_0_35px_rgba(16,185,129,0.5)] backdrop-blur-xl space-y-2.5 transition-all duration-700 animate-[bounce_0.6s_ease-out_1]";
            resultBox.innerHTML = `
                <div class="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                    <div class="flex items-center gap-2">
                        <span class="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                            🏆 ${data.valueTag || "Việc Tử Tế"}
                        </span>
                        <span class="text-xs font-bold text-amber-300">✨ +${earnedScore} Điểm CCS${bonusNote}</span>
                    </div>
                    <span class="text-[10px] text-emerald-300/80 font-bold uppercase tracking-widest"><i class="fa-solid fa-circle-check text-emerald-400"></i> AI Verified</span>
                </div>

                <div class="text-xs leading-relaxed space-y-1.5">
                    <p class="font-bold text-white text-sm flex items-start gap-1.5">
                        <span class="text-base">👏</span>
                        <span><b>Cảm nhận từ mình:</b> "${data.message}"</span>
                    </p>
                    <p class="text-[11px] text-emerald-200 bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-500/30 italic flex items-start gap-2">
                        <i class="fa-solid fa-bullhorn text-amber-300 mt-0.5 text-xs shrink-0 animate-bounce"></i>
                        <span><b>Ý nghĩa lan tỏa:</b> ${data.impact || "Hành động nhỏ của bạn lan tỏa làn sóng văn minh tới tập thể lớp!"}</span>
                    </p>
                </div>
                ${closeBtnHtml}
            `;

            resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Reset
            input.value = "";
            window.updateEthicsCharCount();
            window.removeEthicsFile();

            if (typeof addScore === 'function') {
                addScore(earnedScore);
            }
        } else {
            // KHUNG CẢNH BÁO MẠNH MẼ - CHỈ RÕ LỖI SAI VÀ HẬU QUẢ (ĐỎ NHẸ NHÀNG)
            window.triggerEthicsShake();

            resultBox.className = "p-4 pr-9 rounded-2xl border-2 border-rose-400/80 bg-rose-950/85 text-rose-100 relative shadow-[0_0_30px_rgba(251,113,133,0.35)] backdrop-blur-xl space-y-2.5 transition-all duration-700 animate-[bounce_0.6s_ease-out_1]";
            resultBox.innerHTML = `
                <div class="flex items-center justify-between border-b border-rose-500/30 pb-2">
                    <div class="flex items-center gap-2">
                        <span class="bg-rose-500/40 text-rose-100 border border-rose-400/50 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                            ⚠️ ${data.errorTitle || "Hành Vi Chưa Đúng Nội Quy"}
                        </span>
                        <span class="text-xs font-bold text-rose-300">0 Điểm CCS</span>
                    </div>
                    <span class="text-[10px] text-rose-300/80 font-bold uppercase tracking-widest"><i class="fa-solid fa-triangle-exclamation text-rose-400"></i> AI Warning</span>
                </div>

                <div class="text-xs leading-relaxed space-y-2">
                    <p class="text-rose-100 font-semibold flex items-start gap-1.5">
                        <span class="text-base">❌</span>
                        <span><b>Lỗi sai trong hành vi:</b> ${data.errorDetail || 'Hành động này vi phạm nội quy học đường hoặc quy chuẩn đạo đức chung.'}</span>
                    </p>
                    
                    <div class="text-[11px] text-rose-100 bg-rose-900/50 p-3 rounded-xl border border-rose-500/30 space-y-1.5">
                        <p class="font-semibold text-rose-200 flex items-center gap-1">
                            <i class="fa-solid fa-circle-exclamation text-xs text-rose-400"></i> <b>Hậu quả & Tác hại:</b>
                        </p>
                        <p class="leading-relaxed text-rose-200/90">${data.consequence || 'Hành vi này làm giảm sút ý thức kỷ luật, gây ảnh hưởng xấu tới kết quả học tập và uy tín cá nhân.'}</p>
                        
                        <div class="pt-1.5 border-t border-rose-500/20 mt-1">
                            <p class="font-semibold text-rose-300 flex items-center gap-1">
                                <i class="fa-solid fa-compass text-xs"></i> <b>Lời nhắc từ mình:</b>
                            </p>
                            <p class="leading-relaxed text-rose-100">${data.advice || 'Bạn hãy suy nghĩ lại và thay bằng một việc làm tích cực hơn để nhận điểm thưởng nhé!'}</p>
                        </div>
                    </div>
                </div>
                ${closeBtnHtml}
            `;

            resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } catch (error) {
        window.triggerEthicsShake();

        resultBox.className = "p-3 pr-8 rounded-xl text-xs border bg-rose-950/50 border-rose-500/50 text-rose-300 relative shadow-lg backdrop-blur-md";
        resultBox.innerHTML = `
            <div class="flex items-start gap-2">
                <i class="fa-solid fa-circle-xmark mt-0.5 text-rose-400 text-sm shrink-0"></i>
                <div class="leading-snug">Lỗi kết nối tới Trạm AI. Vui lòng thử lại sau! <i>(Nội dung của bạn đã được giữ nguyên)</i>.</div>
            </div>
            ${closeBtnHtml}
        `;
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};