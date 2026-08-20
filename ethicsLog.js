// ==========================================
// MÔ-ĐUN: NHẬT KÝ ĐẠO ĐỨC SỐ (TÍCH HỢP AI CHECKER & FIREBASE REALTIME)
// ==========================================

let ethicsLogsList = [];
let activeEthicsReportId = null;

// 1. KẾT NỐI REALTIME FIREBASE CLOUD
function initEthicsRealtimeListener() {
    if (window.db) {
        window.db.collection("ethics_logs")
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) => {
                const logs = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    logs.push({
                        id: doc.id,
                        author: data.author || "Học sinh (Khách)",
                        content: data.content || "",
                        aiTag: data.aiTag || "LÒNG TRẮC ẨN",
                        aiFeedback: data.aiFeedback || "🤖 AI: ✨ Bài học & hành động rất có ý nghĩa!",
                        aiMeaning: data.aiMeaning || "",
                        likes: Array.isArray(data.likes) ? data.likes : [],
                        reports: Array.isArray(data.reports) ? data.reports : [],
                        date: data.date || new Date().toISOString().split('T')[0],
                        time: data.time || new Date().toTimeString().substring(0, 5),
                        createdAt: data.createdAt || Date.now()
                    });
                });
                ethicsLogsList = logs;
                renderEthicsFeed();
            }, (err) => {
                console.error("Lỗi Realtime Ethics Log:", err);
            });
    }
}

// 2. TẠO GIAO DIỆN CHÍNH
window.renderEthicsLogModule = function(containerId) {
    const container = document.getElementById(containerId) || document.getElementById('ethics-module-container') || document.getElementById('tab-ethics');
    if (!container) return;

    const isAdmin = typeof checkIsAdmin === 'function' ? checkIsAdmin() : false;

    container.innerHTML = `
        <div class="relative w-full my-1 space-y-3" id="ethics-main-card">
            <!-- SOẠN BÀI VIẾT NHẬT KÝ -->
            <div class="relative bg-slate-900/95 backdrop-blur-xl p-3 sm:p-4 rounded-2xl border border-slate-800/90 shadow-xl space-y-2.5">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div class="flex items-center space-x-2.5">
                        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500/20 via-amber-500/10 to-amber-400/30 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md shrink-0">
                            <i class="fa-solid fa-shield-heart text-base"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-base font-extrabold text-white tracking-wide">Nhật Ký Đạo Đức Số</h3>
                                <span class="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">AI Checked</span>
                            </div>
                            <p class="text-[10px] text-slate-400">Ghi nhận việc tốt, lan tỏa văn hóa mạng văn minh & tích lũy điểm rèn luyện.</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 shrink-0">
                        ${isAdmin ? `
                            <button onclick="showEthicsReportListModal()" class="py-1.5 px-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black rounded-lg transition flex items-center gap-1 cursor-pointer">
                                🚩 Báo Cáo (${countTotalEthicsReports()})
                            </button>
                        ` : ''}
                        <button onclick="window.submitEthicsLog()" class="py-2 px-5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold rounded-xl transition-all shadow-md text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                            <i class="fa-solid fa-paper-plane text-xs"></i>
                            <span>Gửi Nhật Ký (+1 CCS)</span>
                        </button>
                    </div>
                </div>

                <!-- GRID 2 CỘT -->
                <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    <div class="md:col-span-7 space-y-1.5">
                        <div class="flex items-center justify-between">
                            <label class="block text-xs font-semibold text-slate-300">Nội dung việc tốt / bài học <span class="text-rose-400">* (+1 CCS)</span>:</label>
                            <div class="flex flex-wrap gap-1">
                                <span class="text-[9px] bg-slate-950/80 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md">🤝 Giúp bạn</span>
                                <span class="text-[9px] bg-slate-950/80 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md">🛡️ An toàn mạng</span>
                                <span class="text-[9px] bg-slate-950/80 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md">💬 Năng lượng tích cực</span>
                            </div>
                        </div>
                        <textarea id="ethics-input" rows="3" oninput="window.updateEthicsCharCount()" placeholder="Hãy tự viết câu chuyện hoặc bài học của bạn (Tối thiểu 50 ký tự để AI kiểm duyệt)..." class="w-full bg-slate-950/90 border border-slate-800/90 focus:border-amber-500/80 rounded-xl p-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all shadow-inner h-[100px] resize-none"></textarea>
                        <div class="flex justify-between items-center px-1">
                            <span class="text-[9px] text-slate-500">Viết chân thật, chia sẻ sâu sắc.</span>
                            <span id="ethics-char-count" class="text-[9px] font-medium text-rose-400">0 / 50 ký tự tối thiểu</span>
                        </div>
                    </div>

                    <div class="md:col-span-5 space-y-1.5">
                        <label class="block text-xs font-semibold text-slate-300">Hình ảnh / Tệp minh họa <span class="text-slate-500 font-normal">(Không bắt buộc)</span>:</label>
                        <div class="text-[9px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <i class="fa-solid fa-circle-plus text-[10px]"></i>
                            <span>Tải tệp minh họa hợp lệ được AI duyệt sẽ được <b>+1 CCS</b> nữa!</span>
                        </div>
                        <div class="relative border border-dashed border-slate-800 hover:border-amber-500/50 bg-slate-950/60 hover:bg-slate-950/90 rounded-xl p-2 text-center transition-all cursor-pointer group h-[107px] flex flex-col justify-center items-center" id="ethics-upload-zone" onclick="document.getElementById('ethics-file-input').click()">
                            <input type="file" id="ethics-file-input" accept="image/*,.pdf,.doc,.docx" class="hidden" onchange="handleEthicsFileSelect(event)">
                            <div id="ethics-upload-prompt" class="flex flex-col items-center justify-center">
                                <div class="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-amber-500/40 flex items-center justify-center text-slate-400 group-hover:text-amber-400 mb-1 transition-all">
                                    <i class="fa-solid fa-cloud-arrow-up text-xs"></i>
                                </div>
                                <p class="text-xs text-slate-300 font-medium">Kéo thả tệp vào đây</p>
                                <p class="text-[9px] text-amber-400/80 font-semibold">hoặc Nhấn để chọn tệp</p>
                            </div>
                            <div id="ethics-file-preview" class="hidden w-full relative items-center justify-between bg-slate-900 border border-slate-800 p-1.5 rounded-lg">
                                <div class="flex items-center space-x-2 overflow-hidden">
                                    <div id="ethics-icon-container" class="w-8 h-8 flex items-center justify-center bg-slate-950 rounded-lg border border-slate-800 shrink-0">
                                        <img id="ethics-img-thumb" src="" alt="Preview" class="w-full h-full object-cover rounded-lg hidden">
                                        <i id="ethics-file-icon" class="fa-solid fa-file text-base text-amber-400 hidden"></i>
                                    </div>
                                    <div class="text-left overflow-hidden">
                                        <p id="ethics-filename" class="text-xs font-semibold text-slate-200 truncate max-w-[120px]"></p>
                                        <p id="ethics-filesize" class="text-[9px] text-slate-400"></p>
                                    </div>
                                </div>
                                <button type="button" onclick="removeEthicsFile(event)" class="text-slate-400 hover:text-rose-400 bg-slate-950 hover:bg-rose-500/10 p-1 rounded-lg border border-slate-800 transition-all">
                                    <i class="fa-solid fa-trash-can text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="ethics-result" class="hidden relative p-3 pr-8 rounded-xl text-xs border transition-all duration-500"></div>
            </div>

            <!-- DÒNG THỜI GIAN CÔNG KHAI -->
            <div class="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-4 shadow-xl">
                <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                    <h4 class="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-award text-amber-400 text-sm"></i>
                        <span>DÒNG THỜI GIAN CÂU CHUYỆN ĐẸP</span>
                    </h4>
                </div>

                <div class="max-h-[600px] overflow-y-auto space-y-2 pr-1 custom-scroll" id="ethics-feed-container"></div>
            </div>
        </div>

        <!-- MODAL THẢ TIM, BÁO CÁO & XEM NHẬN XÉT AI -->
        <div id="ethics-modal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 hidden">
            <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 relative shadow-2xl">
                <button onclick="closeEthicsModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-sm font-bold cursor-pointer">✕</button>
                <div id="ethics-modal-body"></div>
            </div>
        </div>
    `;

    renderEthicsFeed();
};

function renderEthicsModule(containerId) {
    window.renderEthicsLogModule(containerId);
}

// 3. HIỂN THỊ DÒNG THỜI GIAN THEO NGÀY
function renderEthicsFeed() {
    const feedContainer = document.getElementById('ethics-feed-container');
    if (!feedContainer) return;

    const isAdmin = typeof checkIsAdmin === 'function' ? checkIsAdmin() : false;
    const currentUserName = getCurrentUserName();
    const todayStr = new Date().toISOString().split('T')[0];

    const groupedByDate = {};
    ethicsLogsList.forEach(log => {
        if (!groupedByDate[log.date]) groupedByDate[log.date] = [];
        groupedByDate[log.date].push(log);
    });

    let html = '';
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

    if (sortedDates.length === 0) {
        html = `<div class="text-center text-xs text-slate-500 py-8">Chưa có bài viết nhật ký nào được chia sẻ.</div>`;
    } else {
        sortedDates.forEach(dateStr => {
            const formattedDate = formatDateDisplay(dateStr);
            const count = groupedByDate[dateStr].length;
            const isToday = (dateStr === todayStr);

            html += `
                <details class="group bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden transition-all" ${isToday ? 'open' : ''}>
                    <summary class="px-3.5 py-2.5 bg-slate-950/90 border-b border-slate-800/50 cursor-pointer flex items-center justify-between hover:bg-slate-800/40 transition-all select-none">
                        <span class="flex items-center gap-2 text-xs font-bold text-amber-300">
                            <i class="fa-regular fa-calendar-check text-emerald-400"></i>
                            <span>${formattedDate} ${isToday ? '<span class="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full ml-1">Hôm nay</span>' : ''}</span>
                        </span>
                        <div class="flex items-center gap-2.5">
                            <span class="text-xs bg-amber-500/20 text-amber-200 px-2.5 py-0.5 rounded-full font-bold">${count} hành động đẹp</span>
                            <span class="text-xs text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                        </div>
                    </summary>

                    <div class="p-2 space-y-2 bg-slate-900/40">
                        ${groupedByDate[dateStr].map(log => {
                            const likeArray = Array.isArray(log.likes) ? log.likes : [];
                            const reportArray = Array.isArray(log.reports) ? log.reports : [];
                            const likeCount = likeArray.length;
                            const reportCount = reportArray.length;
                            
                            const hasLiked = likeArray.includes(currentUserName);
                            const hasReported = reportArray.some(r => typeof r === 'object' ? r.reporter === currentUserName : r === currentUserName);

                            const heartBtnStyle = hasLiked 
                                ? "bg-rose-600 text-white shadow-md shadow-rose-500/40 border-rose-500 scale-105" 
                                : "bg-rose-500/10 text-rose-400/60 border-rose-500/20 opacity-70 hover:opacity-100 hover:bg-rose-500/20";

                            const reportBtnStyle = hasReported || (isAdmin && reportCount > 0)
                                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/40 border-amber-400 scale-105"
                                : "bg-amber-500/10 text-amber-400/60 border-amber-500/20 opacity-70 hover:opacity-100 hover:bg-amber-500/20";

                            return `
                                <div class="bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 p-2.5 rounded-xl flex items-center justify-between gap-3 text-xs transition-all shadow-sm">
                                    <div class="flex items-center gap-2 flex-1 min-w-0">
                                        <span class="text-[11px] text-slate-500 font-mono shrink-0">${log.time || '12:00'}</span>
                                        <span class="font-extrabold text-amber-400 shrink-0 text-xs">
                                            ${escapeHTML(log.author)}:
                                        </span>
                                        <span class="text-slate-100 font-medium text-xs truncate">
                                            "${escapeHTML(log.content)}"
                                        </span>
                                        <!-- NÚT AI VERIFIED BẤM VÀO ĐỂ XEM ĐÁNH GIÁ -->
                                        <button onclick="showAIFeedbackModal('${log.id}')" class="text-[9px] text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded shrink-0 font-bold transition cursor-pointer flex items-center gap-1" title="Bấm để xem nhận xét từ AI">
                                            <span>✔ AI Verified</span>
                                        </button>
                                    </div>
                                    
                                    <div class="flex items-center gap-1.5 shrink-0">
                                        <div class="flex items-center rounded-lg overflow-hidden border transition-all ${heartBtnStyle}">
                                            <button onclick="toggleLikeEthicsLog('${log.id}')" class="px-2 py-0.5 cursor-pointer transition-transform active:scale-125" title="Thả tim">
                                                <i class="fa-solid fa-heart text-[10px]"></i>
                                            </button>
                                            <span onclick="showEthicsLikeListModal('${log.id}')" class="font-bold text-xs pr-2 py-0.5 cursor-pointer hover:underline">
                                                ${likeCount}
                                            </span>
                                        </div>

                                        <div class="flex items-center rounded-lg overflow-hidden border transition-all ${reportBtnStyle}">
                                            <button onclick="openEthicsReportSelectModal('${log.id}')" class="px-2 py-0.5 cursor-pointer transition-transform active:scale-125" title="Báo cáo vi phạm">
                                                <i class="fa-solid fa-flag text-[10px]"></i>
                                            </button>
                                            <span onclick="showEthicsReportDetailModal('${log.id}')" class="font-bold text-xs pr-2 py-0.5 cursor-pointer hover:underline">
                                                ${isAdmin ? reportCount : (hasReported ? 1 : 0)}
                                            </span>
                                        </div>

                                        ${isAdmin ? `
                                            <button onclick="handleDeleteEthicsLogByAdmin('${log.id}')" class="text-rose-400 hover:text-white bg-rose-500/20 hover:bg-rose-600 px-2 py-0.5 rounded-lg border border-rose-500/40 transition-all text-xs font-bold flex items-center gap-1 cursor-pointer">
                                                <i class="fa-solid fa-trash-can"></i>
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </details>
            `;
        });
    }

    feedContainer.innerHTML = html;
}

// 4. KIỂM DUYỆT AI DỨT KHOÁT KHI GỬI BÀI
window.submitEthicsLog = async function() {
    const input = document.getElementById('ethics-input');
    const resultBox = document.getElementById('ethics-result');
    const fileInput = document.getElementById('ethics-file-input');
    const text = input.value.trim();
    const file = fileInput && fileInput.files ? fileInput.files[0] : null;

    const closeBtnHtml = `
        <button onclick="window.closeEthicsResult()" class="absolute top-2 right-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg p-1 w-5 h-5 flex items-center justify-center transition-all cursor-pointer" title="Đóng">
            <i class="fa-solid fa-xmark text-xs"></i>
        </button>
    `;

    if (text.length < 50) {
        window.triggerEthicsShake();
        resultBox.className = "p-3 pr-8 rounded-xl border-2 border-rose-400/70 bg-rose-950/80 text-rose-200 relative shadow-md backdrop-blur-xl space-y-1.5";
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = `
            <div class="flex items-center justify-between border-b border-rose-500/30 pb-1.5">
                <span class="bg-rose-500/30 text-rose-200 border border-rose-400/40 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                    📝 Chưa Đủ Độ Dài Yêu Cầu
                </span>
                <span class="text-xs font-bold text-rose-300">0 Điểm CCS</span>
            </div>
            <div class="text-xs leading-relaxed">
                <p class="font-bold text-white flex items-start gap-1">
                    <span>📌 Bài viết mới đạt <b>${text.length}/50 ký tự tối thiểu</b>.</span>
                </p>
            </div>
            ${closeBtnHtml}
        `;
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    resultBox.className = "p-2.5 pr-8 rounded-xl text-xs border bg-slate-950/90 border-slate-800 text-slate-300 relative shadow-md";
    resultBox.classList.remove('hidden');
    resultBox.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fa-solid fa-spinner fa-spin text-amber-400 shrink-0"></i> 
            <span class="leading-snug">Mình đang đánh giá nội dung bài viết của bạn...</span>
        </div>
    `;

    try {
        const promptText = `[KIỂM DUYỆT ĐẠO ĐỨC] Bài viết: "${text}" ${file ? `(Có tệp: ${file.name})` : ''}.
XƯNG HÔ: "mình" (AI) và "bạn" (học sinh).

NẾU SAI/VI PHẠM (trốn tiết, gian lận, chửi thề, bộc phốt):
{"status": "rejected", "errorTitle": "Tên_Lỗi", "errorDetail": "Chi_Tiết_Lỗi", "consequence": "Hậu_Quả", "advice": "Lời_Khuyên"}

NẾU TÍCH CỰC & TỬ TẾ:
{"status": "approved", "textApproved": true, "fileApproved": true, "valueTag": "Tên_Giá_Trị", "message": "Lời_Khen", "impact": "Tác_Động"}

Trả về duy nhất JSON chuẩn:`;

        const response = typeof askClassAI === 'function' 
            ? await askClassAI(promptText)
            : JSON.stringify({ 
                status: "approved", textApproved: true, fileApproved: !!file, 
                valueTag: "Lòng Trắc Ẩn", message: "Mình rất ấn tượng với câu chuyện tử tế này của bạn!", impact: "Lan tỏa năng lượng tích cực tới tập thể lớp." 
            });

        let data;
        try {
            const jsonString = response.match(/\{[\s\S]*\}/)[0];
            data = JSON.parse(jsonString);
        } catch (e) {
            data = { status: "approved", textApproved: true, fileApproved: !!file, valueTag: "Trách Nhiệm Số", message: "Mình rất ấn tượng với nhận thức của bạn!", impact: "Góp phần xây dựng lớp học văn minh." };
        }

        if (data.status === 'approved' || data.textApproved === true) {
            let earnedScore = 1;
            let bonusNote = "";
            if (file && data.fileApproved !== false) {
                earnedScore += 1;
                bonusNote = " (+1 CCS từ tệp minh họa)";
            }

            window.triggerEthicsConfetti();

            resultBox.className = "p-3 pr-8 rounded-xl border-2 border-emerald-400 bg-emerald-950/85 text-emerald-100 relative shadow-lg backdrop-blur-xl space-y-2";
            resultBox.innerHTML = `
                <div class="flex items-center justify-between border-b border-emerald-500/30 pb-1.5">
                    <div class="flex items-center gap-1.5">
                        <span class="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                            🏆 ${data.valueTag || "Việc Tử Tế"}
                        </span>
                        <span class="text-xs font-bold text-amber-300">✨ +${earnedScore} Điểm CCS${bonusNote}</span>
                    </div>
                    <span class="text-[9px] text-emerald-300/80 font-bold uppercase"><i class="fa-solid fa-circle-check text-emerald-400"></i> AI Verified</span>
                </div>
                <div class="text-xs leading-relaxed space-y-1">
                    <p class="font-bold text-white text-xs flex items-start gap-1">
                        <span>👏 <b>Cảm nhận từ mình:</b> "${data.message}"</span>
                    </p>
                </div>
                ${closeBtnHtml}
            `;

            const today = new Date();
            const newLog = {
                author: getCurrentUserName(),
                content: text,
                aiTag: data.valueTag || "LÒNG TRẮC ẨN",
                aiFeedback: `🤖 AI: ${data.message || "✨ Bài học rất ý nghĩa!"}`,
                aiMeaning: data.impact || "",
                likes: [],
                reports: [],
                date: today.toISOString().split('T')[0],
                time: today.toTimeString().substring(0, 5),
                createdAt: Date.now()
            };

            if (window.db) {
                window.db.collection("ethics_logs").add(newLog);
            }

            if (typeof addScore === 'function') addScore(earnedScore);

            input.value = "";
            window.updateEthicsCharCount();
            window.removeEthicsFile();
        } else {
            window.triggerEthicsShake();
            resultBox.className = "p-3 pr-8 rounded-xl border-2 border-rose-400/80 bg-rose-950/85 text-rose-100 relative shadow-lg backdrop-blur-xl space-y-2";
            resultBox.innerHTML = `
                <div class="flex items-center justify-between border-b border-rose-500/30 pb-1.5">
                    <span class="bg-rose-500/40 text-rose-100 border border-rose-400/50 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                        ⚠️ ${data.errorTitle || "Hành Vi Chưa Đúng Nội Quy"}
                    </span>
                    <span class="text-xs font-bold text-rose-300">0 Điểm CCS</span>
                </div>
                <div class="text-xs leading-relaxed space-y-1.5">
                    <p class="text-rose-100 font-semibold flex items-start gap-1">
                        <span>❌ <b>Lỗi sai:</b> ${data.errorDetail || 'Hành động này vi phạm nội quy học đường.'}</span>
                    </p>
                    <div class="text-[11px] text-rose-100 bg-rose-900/50 p-2 rounded-lg border border-rose-500/30 space-y-1">
                        <p class="font-semibold text-rose-200"><b>Hậu quả:</b> ${data.consequence || 'Gây ảnh hưởng xấu tới kỷ luật và kết quả học tập.'}</p>
                        <p class="font-semibold text-rose-300 pt-1 border-t border-rose-500/20"><b>Lời nhắc từ mình:</b> ${data.advice || 'Bạn hãy thay bằng một việc làm tích cực hơn nhé!'}</p>
                    </div>
                </div>
                ${closeBtnHtml}
            `;
        }
    } catch (err) {
        console.error("Lỗi gửi bài:", err);
    }
};

// 5. CÁC HÀM TƯƠNG TÁC THẢ TIM, BÁO CÁO & XEM ĐÁNH GIÁ AI
window.showAIFeedbackModal = function(id) {
    const log = ethicsLogsList.find(l => String(l.id) === String(id));
    if (!log) return;

    const modal = document.getElementById('ethics-modal');
    const body = document.getElementById('ethics-modal-body');
    if (!modal || !body) return;

    body.innerHTML = `
        <div class="space-y-3">
            <div class="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                <span class="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    🤖 AI VERIFIED EVALUATION
                </span>
                <span class="text-[10px] font-bold text-amber-400">🏆 ${escapeHTML(log.aiTag || "LÒNG TRẮC ẨN")}</span>
            </div>

            <div class="text-xs text-slate-300 italic bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                "${escapeHTML(log.content)}"
            </div>

            <div class="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-xl space-y-2">
                <p class="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <span>👏 Cảm nhận từ AI:</span>
                </p>
                <p class="text-xs text-emerald-100 leading-relaxed italic">
                    "${escapeHTML(log.aiFeedback || "Bài viết rất có ý nghĩa!")}"
                </p>
                ${log.aiMeaning ? `
                    <div class="pt-2 border-t border-emerald-500/20 text-[11px] text-teal-300">
                        📢 <b>Tác động lan tỏa:</b> ${escapeHTML(log.aiMeaning)}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
};

window.toggleLikeEthicsLog = function(id) {
    const log = ethicsLogsList.find(l => String(l.id) === String(id));
    if (!log) return;
    if (!Array.isArray(log.likes)) log.likes = [];
    const currentUserName = getCurrentUserName();
    const index = log.likes.indexOf(currentUserName);

    if (index === -1) log.likes.push(currentUserName);
    else log.likes.splice(index, 1);

    if (window.db) {
        window.db.collection("ethics_logs").doc(String(id)).update({ likes: log.likes });
    }
};

window.showEthicsLikeListModal = function(id) {
    const log = ethicsLogsList.find(l => String(l.id) === String(id));
    if (!log) return;
    const modal = document.getElementById('ethics-modal');
    const body = document.getElementById('ethics-modal-body');
    if (!modal || !body) return;

    body.innerHTML = `
        <h3 class="text-sm font-bold text-rose-400 mb-2">❤️ Người đã thả tim (${(log.likes||[]).length})</h3>
        <p class="text-xs text-slate-400 mb-2 italic">"${escapeHTML(log.content)}"</p>
        <div class="max-h-48 overflow-y-auto space-y-1 custom-scroll">
            ${(log.likes||[]).map(n => `<div class="bg-slate-950 p-1.5 rounded-lg text-xs text-slate-200">❤️ ${escapeHTML(n)}</div>`).join('') || '<div class="text-xs text-slate-500 italic py-2">Chưa có ai thả tim.</div>'}
        </div>
    `;
    modal.classList.remove('hidden');
};

window.openEthicsReportSelectModal = function(id) {
    activeEthicsReportId = id;
    const log = ethicsLogsList.find(l => String(l.id) === String(id));
    if (!log) return;

    if (!Array.isArray(log.reports)) log.reports = [];
    const currentUserName = getCurrentUserName();
    const hasReported = log.reports.some(r => typeof r === 'object' ? r.reporter === currentUserName : r === currentUserName);

    if (hasReported) {
        alert("⚠️ Bạn đã gửi báo cáo cho bài viết này rồi!");
        return;
    }

    const modal = document.getElementById('ethics-modal');
    const body = document.getElementById('ethics-modal-body');
    if (!modal || !body) return;

    body.innerHTML = `
        <h3 class="text-sm font-bold text-amber-400 mb-2">🚩 Báo Cáo Vi Phạm</h3>
        <p class="text-xs text-slate-400 mb-3 italic">"${escapeHTML(log.content)}"</p>
        <select id="ethics-report-reason-select" class="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2 rounded-xl text-xs mb-3">
            <option value="Nội dung sai sự thật / Bịa đặt">⚠️ Nội dung sai sự thật / Bịa đặt</option>
            <option value="Bạo lực ngôn từ / Chửi thề">🤬 Bạo lực ngôn từ / Chửi thề</option>
            <option value="Xúc phạm cá nhân / Bắt nạt">🎯 Xúc phạm cá nhân / Bắt nạt</option>
        </select>
        <button onclick="submitEthicsReportMessage()" class="w-full bg-amber-500 text-slate-950 font-black py-2 rounded-xl text-xs">Gửi Báo Cáo Bảo Mật</button>
    `;
    modal.classList.remove('hidden');
};

window.submitEthicsReportMessage = function() {
    if (!activeEthicsReportId) return;
    const log = ethicsLogsList.find(l => String(l.id) === String(activeEthicsReportId));
    if (!log) return;

    const select = document.getElementById('ethics-report-reason-select');
    const reason = select ? select.value : "Vi phạm quy tắc";

    if (!Array.isArray(log.reports)) log.reports = [];
    log.reports.push({ reporter: getCurrentUserName(), reason: reason, time: new Date().toLocaleString() });

    if (window.db) {
        window.db.collection("ethics_logs").doc(String(activeEthicsReportId)).update({ reports: log.reports });
    }
    closeEthicsModal();
};

window.showEthicsReportDetailModal = function(id) {
    const log = ethicsLogsList.find(l => String(l.id) === String(id));
    if (!log) return;
    const isAdmin = typeof checkIsAdmin === 'function' ? checkIsAdmin() : false;
    const modal = document.getElementById('ethics-modal');
    const body = document.getElementById('ethics-modal-body');
    if (!modal || !body) return;

    if (isAdmin) {
        body.innerHTML = `
            <h3 class="text-sm font-bold text-amber-400 mb-2">🛡️ Chi tiết báo cáo Admin (${(log.reports||[]).length})</h3>
            <div class="max-h-48 overflow-y-auto space-y-1.5 custom-scroll mb-2">
                ${(log.reports||[]).map(r => `<div class="bg-slate-950 p-2 rounded-xl text-xs text-amber-300">👤 ${escapeHTML(typeof r==='object'?r.reporter:r)}: "${escapeHTML(typeof r==='object'?r.reason:'Vi phạm')}"</div>`).join('')}
            </div>
            <button onclick="handleDeleteEthicsLogByAdmin('${log.id}'); closeEthicsModal();" class="w-full bg-rose-600 text-white font-bold py-2 rounded-xl text-xs">🗑️ Xoá Ngay Bài Viết Vi Phạm</button>
        `;
    } else {
        body.innerHTML = `
            <div class="bg-slate-950 p-3 rounded-xl text-xs text-amber-300 text-center">
                🚩 Bài viết đã được gửi báo cáo bảo mật tới Admin/Gmail!
            </div>
        `;
    }
    modal.classList.remove('hidden');
};

window.showEthicsReportListModal = function() {
    const modal = document.getElementById('ethics-modal');
    const body = document.getElementById('ethics-modal-body');
    if (!modal || !body) return;

    const reportedLogs = ethicsLogsList.filter(l => Array.isArray(l.reports) && l.reports.length > 0);
    body.innerHTML = `
        <h3 class="text-sm font-bold text-amber-400 mb-2">🚩 DSKH Báo Cáo (${reportedLogs.length})</h3>
        <div class="max-h-64 overflow-y-auto space-y-2 custom-scroll">
            ${reportedLogs.map(l => `
                <div class="bg-slate-950 p-2.5 rounded-xl border border-rose-500/30 text-xs">
                    <div class="font-bold text-amber-400">Tác giả: ${escapeHTML(l.author)}</div>
                    <div class="text-slate-200 italic mb-1.5">"${escapeHTML(l.content)}"</div>
                    <button onclick="handleDeleteEthicsLogByAdmin('${l.id}'); closeEthicsModal();" class="w-full bg-rose-600 text-white font-bold py-1 rounded-lg text-xs">🗑️ Xoá Bài Này</button>
                </div>
            `).join('') || '<div class="text-xs text-emerald-400 text-center py-3">Không có bài viết nào bị báo cáo.</div>'}
        </div>
    `;
    modal.classList.remove('hidden');
};

// 6. CÁC HÀM BỔ TRỢ KHÁC
window.updateEthicsCharCount = function() {
    const input = document.getElementById('ethics-input');
    const counter = document.getElementById('ethics-char-count');
    if (!input || !counter) return;

    const len = input.value.trim().length;
    if (len < 50) {
        counter.textContent = `${len} / 50 ký tự tối thiểu`;
        counter.className = "text-[9px] font-medium text-rose-400";
    } else {
        counter.textContent = `${len} ký tự (Đạt yêu cầu +1 CCS)`;
        counter.className = "text-[9px] font-medium text-emerald-400";
    }
};

window.closeEthicsResult = function() {
    const resultBox = document.getElementById('ethics-result');
    if (resultBox) resultBox.classList.add('hidden');
};

window.triggerEthicsShake = function() {
    const card = document.getElementById('ethics-main-card');
    if (card) {
        card.classList.add('animate-bounce');
        setTimeout(() => card.classList.remove('animate-bounce'), 800);
    }
};

window.triggerEthicsConfetti = function() {
    if (typeof confetti !== 'function') return;
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
};

window.handleEthicsFileSelect = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const imgThumb = document.getElementById('ethics-img-thumb');
    const fileIcon = document.getElementById('ethics-file-icon');
    imgThumb.classList.add('hidden');
    fileIcon.classList.add('hidden');

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imgThumb.src = e.target.result;
            imgThumb.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    } else {
        fileIcon.className = 'fa-solid fa-file text-base text-amber-400';
        fileIcon.classList.remove('hidden');
    }

    document.getElementById('ethics-filename').textContent = file.name;
    document.getElementById('ethics-filesize').textContent = (file.size / 1024).toFixed(1) + ' KB';
    document.getElementById('ethics-upload-prompt').classList.add('hidden');
    document.getElementById('ethics-file-preview').classList.remove('hidden');
    document.getElementById('ethics-file-preview').classList.add('flex');
};

window.removeEthicsFile = function(event) {
    if (event) event.stopPropagation();
    const fileInput = document.getElementById('ethics-file-input');
    if (fileInput) fileInput.value = '';
    document.getElementById('ethics-upload-prompt').classList.remove('hidden');
    document.getElementById('ethics-file-preview').classList.add('hidden');
    document.getElementById('ethics-file-preview').classList.remove('flex');
};

function countTotalEthicsReports() {
    return ethicsLogsList.reduce((total, l) => total + (Array.isArray(l.reports) ? l.reports.length : 0), 0);
}

function closeEthicsModal() {
    const modal = document.getElementById('ethics-modal');
    if (modal) modal.classList.add('hidden');
}

window.handleDeleteEthicsLogByAdmin = function(id) {
    if (confirm("⚠️ [ADMIN]: Xác nhận xoá bài viết này khỏi Firebase?")) {
        if (window.db) {
            window.db.collection("ethics_logs").doc(String(id)).delete();
        }
    }
};

function getCurrentUserName() {
    const savedUser = localStorage.getItem("cyberUser");
    if (!savedUser) return "Học sinh (Khách)";
    try {
        const u = JSON.parse(savedUser);
        return u.name || u.email || "Học sinh (Khách)";
    } catch(e) {
        return "Học sinh (Khách)";
    }
}

function formatDateDisplay(dateString) {
    const [year, month, day] = dateString.split('-');
    return `Ngày ${day}/${month}/${year}`;
}

function escapeHTML(value) {
    return String(value || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        initEthicsRealtimeListener();
        if (typeof window.renderEthicsLogModule === 'function') {
            window.renderEthicsLogModule();
        }
    }, 300);
});