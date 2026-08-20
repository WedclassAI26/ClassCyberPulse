// ==========================================
// MÔ-ĐUN: TRẠM TỬ TẾ (TÍCH HỢP FIREBASE CLOUD REALTIME)
// ==========================================

let kindnessMessages = [];
let activeReportMsgId = null;

// 1. TẢI DỮ LIỆU TỪ FIREBASE (HOẶC LOCALSTORAGE NẾU NGOẠI TUYẾN)
function initKindnessRealtimeListener() {
    if (window.db) {
        // Tải Realtime từ Cloud Firestore
        window.db.collection("kindness_messages")
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) => {
                const cloudMsgs = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    cloudMsgs.push({
                        id: doc.id,
                        sender: data.sender || "Khách",
                        receiver: data.receiver || "Tất cả bạn bè",
                        content: data.content || "",
                        aiComment: data.aiComment || "🤖 AI: ✨ Lời chúc tuyệt vời!",
                        likes: Array.isArray(data.likes) ? data.likes : [],
                        reports: Array.isArray(data.reports) ? data.reports : [],
                        hashtag: data.hashtag || "#LanTỏa",
                        date: data.date || new Date().toISOString().split('T')[0],
                        time: data.time || new Date().toTimeString().substring(0, 5),
                        createdAt: data.createdAt || Date.now()
                    });
                });
                kindnessMessages = cloudMsgs;
                // Sao lưu bản sao về localStorage
                try {
                    localStorage.setItem("kindness_messages_data", JSON.stringify(kindnessMessages));
                } catch(e){}
                renderZaloFeed();
            }, (error) => {
                console.error("Lỗi Firestore Snapshot:", error);
                loadFromLocalStorage();
            });
    } else {
        loadFromLocalStorage();
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem("kindness_messages_data");
        if (saved) {
            kindnessMessages = JSON.parse(saved);
        } else {
            kindnessMessages = [
                {
                    id: "1",
                    sender: "Từ Lớp 11A1",
                    receiver: "Lớp 10A2",
                    content: "Chào mừng các em 10A2 gia nhập hành trình lan tỏa năng lượng tích cực!",
                    aiComment: "🤖 AI: ★ Chào mừng ấm áp!",
                    likes: ["Bạn Nam (11A1)", "Bạn Chi (12A1)"],
                    reports: [],
                    hashtag: "#ChàoMừng",
                    date: "2026-08-19",
                    time: "08:15",
                    createdAt: 1787130900000
                }
            ];
        }
    } catch (e) {
        kindnessMessages = [];
    }
    renderZaloFeed();
}

function saveMessageToCloudOrLocal(newMessage) {
    if (window.db) {
        window.db.collection("kindness_messages").add(newMessage)
            .then(() => {
                showKindnessStatus("✅ Lời chúc đã được lưu & đồng bộ mây thành công! (+1 CCS)", "text-emerald-400");
            })
            .catch((err) => {
                console.error("Lỗi lưu mây:", err);
                fallbackSaveLocal(newMessage);
            });
    } else {
        fallbackSaveLocal(newMessage);
    }
}

function fallbackSaveLocal(newMessage) {
    kindnessMessages.unshift(newMessage);
    try {
        localStorage.setItem("kindness_messages_data", JSON.stringify(kindnessMessages));
        localStorage.setItem("kindness_sync_trigger", Date.now().toString());
    } catch (e) {}
    renderZaloFeed();
    showKindnessStatus("✅ Lời chúc đã lưu nội bộ! (+1 CCS)", "text-emerald-400");
}

function updateMessageInCloudOrLocal(msgId, updateData) {
    if (window.db) {
        window.db.collection("kindness_messages").doc(String(msgId)).update(updateData)
            .catch((err) => {
                console.error("Lỗi cập nhật Firestore:", err);
                saveAndBroadcastLocal();
            });
    } else {
        saveAndBroadcastLocal();
    }
}

function deleteMessageFromCloudOrLocal(msgId) {
    if (window.db) {
        window.db.collection("kindness_messages").doc(String(msgId)).delete()
            .then(() => {
                showKindnessStatus("🗑️ Đã xoá lời chúc không phù hợp khỏi hệ thống mây!", "text-rose-400");
            })
            .catch((err) => {
                console.error("Lỗi xoá trên Firestore:", err);
                kindnessMessages = kindnessMessages.filter(msg => String(msg.id) !== String(msgId));
                saveAndBroadcastLocal();
            });
    } else {
        kindnessMessages = kindnessMessages.filter(msg => String(msg.id) !== String(msgId));
        saveAndBroadcastLocal();
        showKindnessStatus("🗑️ Đã xoá lời chúc không phù hợp!", "text-rose-400");
    }
}

function saveAndBroadcastLocal() {
    try {
        localStorage.setItem("kindness_messages_data", JSON.stringify(kindnessMessages));
        localStorage.setItem("kindness_sync_trigger", Date.now().toString());
    } catch (e) {}
    renderZaloFeed();
}

function getCurrentUserName() {
    const savedUser = localStorage.getItem("cyberUser");
    if (!savedUser) return "Bạn (Khách)";
    try {
        const u = JSON.parse(savedUser);
        return u.name || u.email || "Bạn (Khách)";
    } catch(e) {
        return "Bạn (Khách)";
    }
}

window.renderKindnessModule = function(containerId) {
    const targetId = containerId || 'kindness-module-container';
    let container = document.getElementById(targetId);
    
    if (!container) {
        container = document.getElementById('kindness-module-container') || 
                    document.getElementById('wall-messages') || 
                    document.getElementById('tab-wall');
    }

    if (!container) return;

    const isAdmin = typeof checkIsAdmin === 'function' ? checkIsAdmin() : false;

    container.innerHTML = `
        <div class="space-y-5 w-full">
            <div class="bg-slate-900/90 border border-cyan-500/40 p-4 rounded-3xl backdrop-blur-xl shadow-2xl">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-sm font-black text-white flex items-center gap-2">
                        <i class="fa-solid fa-heart-circle-bolt text-rose-400 text-base"></i>
                        <span>Trạm Tử Tế (Kindness Station)</span>
                    </h3>
                    <div class="flex items-center gap-2">
                        ${isAdmin ? `
                            <button onclick="showReportListModal()" class="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black px-3 py-1 rounded-full shadow-md transition flex items-center gap-1 cursor-pointer">
                                🚩 DSKH Báo Cáo (${countTotalReports()})
                            </button>
                            <span class="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black px-3 py-1 rounded-full shadow-md">🛡️ ADMIN</span>
                        ` : ''}
                        <span class="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full">
                            ✨ +1 CCS / Lời chúc
                        </span>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <input type="text" id="kindness-receiver" placeholder="Gửi tới (Ví dụ: Lớp 11A1, Bạn Nam...)" 
                        class="bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-xs text-white px-4 py-2.5 rounded-xl outline-none">
                    
                    <select id="kindness-hashtag" class="bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-xs text-slate-300 px-4 py-2.5 rounded-xl outline-none">
                        <option value="#LanTỏa">#LanTỏa - Năng lượng tích cực</option>
                        <option value="#ThiTốt">#ThiTốt - Chúc thi may mắn</option>
                        <option value="#CảmƠn">#CảmƠn - Tri ân bạn bè/thầy cô</option>
                        <option value="#ĐoànKết">#ĐoànKết - Sức mạnh tập thể</option>
                    </select>
                </div>

                <div class="flex gap-3">
                    <input type="text" id="kindness-input" placeholder="Nhập lời nhắn gửi ngắn gọn chân thành tới bạn bè..." 
                        class="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-xs text-white px-4 py-3 rounded-2xl outline-none">
                    
                    <button id="btn-send-kindness" onclick="handleSendKindnessMessage()" 
                        class="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0">
                        <i class="fa-solid fa-paper-plane text-xs"></i>
                        <span>Gửi (+1 CCS)</span>
                    </button>
                </div>

                <div id="kindness-status" class="mt-2 text-[11px] hidden"></div>
            </div>

            <div class="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-5 shadow-2xl">
                <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                    <h4 class="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-comments text-cyan-400 text-base"></i>
                        <span>DÒNG THỜI GIAN LỜI CHÚC</span>
                    </h4>
                    <span class="text-xs text-emerald-400 font-bold">● Đồng bộ Realtime Firebase</span>
                </div>

                <div class="max-h-[650px] overflow-y-auto space-y-3 pr-2 custom-scroll" id="zalo-feed-container"></div>
            </div>
        </div>

        <div id="kindness-modal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 hidden">
            <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 relative shadow-2xl">
                <button onclick="closeKindnessModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white text-sm font-bold">✕</button>
                <div id="kindness-modal-body"></div>
            </div>
        </div>
    `;

    renderZaloFeed();
};

function renderZaloFeed() {
    const feedContainer = document.getElementById('zalo-feed-container');
    if (!feedContainer) return;

    const isAdmin = typeof checkIsAdmin === 'function' ? checkIsAdmin() : false;
    const currentUserName = getCurrentUserName();

    const todayStr = new Date().toISOString().split('T')[0];

    const groupedByDate = {};
    kindnessMessages.forEach(msg => {
        if (!groupedByDate[msg.date]) groupedByDate[msg.date] = [];
        groupedByDate[msg.date].push(msg);
    });

    let html = '';
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

    if (sortedDates.length === 0) {
        html = `<div class="text-center text-xs text-slate-500 py-10">Chưa có lời chúc nào. Hãy gửi thông điệp đầu tiên nhé!</div>`;
    } else {
        sortedDates.forEach(dateStr => {
            const formattedDate = formatDateDisplay(dateStr);
            const count = groupedByDate[dateStr].length;
            const isToday = (dateStr === todayStr);

            html += `
                <details class="group bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden transition-all" ${isToday ? 'open' : ''}>
                    <summary class="px-4 py-3 bg-slate-950/90 border-b border-slate-800/50 cursor-pointer flex items-center justify-between hover:bg-slate-800/40 transition-all select-none">
                        <span class="flex items-center gap-2 text-xs font-bold text-cyan-300">
                            <i class="fa-regular fa-calendar-check text-amber-400"></i>
                            <span>${formattedDate} ${isToday ? '<span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full ml-1">Hôm nay</span>' : ''}</span>
                        </span>
                        <div class="flex items-center gap-3">
                            <span class="text-xs bg-cyan-500/20 text-cyan-200 px-3 py-0.5 rounded-full font-bold">${count} thông điệp</span>
                            <span class="text-xs text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                        </div>
                    </summary>

                    <div class="p-3 space-y-2 bg-slate-900/40">
                        ${groupedByDate[dateStr].map(msg => {
                            const likeArray = Array.isArray(msg.likes) ? msg.likes : [];
                            const reportArray = Array.isArray(msg.reports) ? msg.reports : [];
                            
                            const likeCount = likeArray.length;
                            const reportCount = reportArray.length;
                            const hasLiked = likeArray.includes(currentUserName);

                            const heartBtnStyle = hasLiked 
                                ? "bg-rose-600 text-white shadow-lg shadow-rose-500/40 border-rose-500 scale-105" 
                                : "bg-rose-500/10 text-rose-400/60 border-rose-500/20 opacity-70 hover:opacity-100 hover:bg-rose-500/20";

                            const reportBtnStyle = reportCount > 0
                                ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/40 border-amber-400 scale-105"
                                : "bg-amber-500/10 text-amber-400/60 border-amber-500/20 opacity-70 hover:opacity-100 hover:bg-amber-500/20";

                            return `
                                <div class="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/40 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs transition-all shadow-md">
                                    <div class="flex items-center gap-3 flex-1 min-w-0">
                                        <span class="text-xs text-slate-500 font-mono shrink-0">${msg.time || '12:00'}</span>
                                        <span class="font-extrabold text-cyan-400 shrink-0 text-xs">
                                            ${escapeHTML(msg.sender)} ➔ ${escapeHTML(msg.receiver)}:
                                        </span>
                                        <span class="text-slate-200 italic truncate text-xs font-medium">
                                            "${escapeHTML(msg.content)}"
                                        </span>
                                        <span class="text-xs text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20 shrink-0 hidden lg:inline-block font-mono">
                                            ${escapeHTML(msg.aiComment)}
                                        </span>
                                    </div>
                                    
                                    <div class="flex items-center gap-1.5 shrink-0">
                                        <div class="flex items-center rounded-xl overflow-hidden border transition-all ${heartBtnStyle}">
                                            <button onclick="toggleLikeMessage('${msg.id}')" class="px-2 py-1 cursor-pointer transition-transform active:scale-125">
                                                <i class="fa-solid fa-heart text-xs"></i>
                                            </button>
                                            <span onclick="showLikeListModal('${msg.id}')" class="font-bold text-xs pr-2.5 py-1 cursor-pointer hover:underline">
                                                ${likeCount}
                                            </span>
                                        </div>

                                        <div class="flex items-center rounded-xl overflow-hidden border transition-all ${reportBtnStyle}">
                                            <button onclick="openReportSelectModal('${msg.id}')" class="px-2 py-1 cursor-pointer transition-transform active:scale-125">
                                                <i class="fa-solid fa-flag text-xs"></i>
                                            </button>
                                            <span onclick="showReportDetailModal('${msg.id}')" class="font-bold text-xs pr-2.5 py-1 cursor-pointer hover:underline">
                                                ${reportCount}
                                            </span>
                                        </div>

                                        ${isAdmin ? `
                                            <button onclick="handleDeleteMessageByAdmin('${msg.id}')" class="text-rose-400 hover:text-white bg-rose-500/20 hover:bg-rose-600 px-2 py-1 rounded-xl border border-rose-500/40 transition-all text-xs font-bold flex items-center gap-1 cursor-pointer">
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

window.toggleLikeMessage = function(id) {
    const msg = kindnessMessages.find(m => String(m.id) === String(id));
    if (!msg) return;

    if (!Array.isArray(msg.likes)) msg.likes = [];

    const currentUserName = getCurrentUserName();
    const index = msg.likes.indexOf(currentUserName);

    if (index === -1) {
        msg.likes.push(currentUserName);
    } else {
        msg.likes.splice(index, 1);
    }

    updateMessageInCloudOrLocal(id, { likes: msg.likes });
    renderZaloFeed();
};

window.showLikeListModal = function(id) {
    const msg = kindnessMessages.find(m => String(m.id) === String(id));
    if (!msg) return;

    if (!Array.isArray(msg.likes)) msg.likes = [];

    const modal = document.getElementById('kindness-modal');
    const body = document.getElementById('kindness-modal-body');
    if (!modal || !body) return;

    body.innerHTML = `
        <h3 class="text-sm font-bold text-rose-400 mb-3 flex items-center gap-2">
            <i class="fa-solid fa-heart text-rose-500"></i>
            <span>Danh sách người đã thả tim (${msg.likes.length})</span>
        </h3>
        <p class="text-xs text-slate-400 mb-3 italic">"${escapeHTML(msg.content)}"</p>
        <div class="max-h-48 overflow-y-auto space-y-1.5 custom-scroll">
            ${msg.likes.length > 0 ? msg.likes.map(name => `
                <div class="bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md">❤️ 1</span>
                        <span class="font-semibold">${escapeHTML(name)}</span>
                    </div>
                </div>
            `).join('') : '<div class="text-xs text-slate-500 italic text-center py-4">Chưa có ai thả tim lời chúc này.</div>'}
        </div>
    `;
    modal.classList.remove('hidden');
};

window.openReportSelectModal = function(id) {
    activeReportMsgId = id;
    const msg = kindnessMessages.find(m => String(m.id) === String(id));
    if (!msg) return;

    const modal = document.getElementById('kindness-modal');
    const body = document.getElementById('kindness-modal-body');
    if (!modal || !body) return;

    body.innerHTML = `
        <h3 class="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>Báo Cáo Nội Dung Vi Phạm</span>
        </h3>
        <p class="text-xs text-slate-400 mb-3 italic">"${escapeHTML(msg.content)}"</p>
        
        <div class="space-y-2 mb-4 text-xs">
            <label class="block font-semibold text-slate-300">Chọn lý do vi phạm:</label>
            <select id="report-reason-select" onchange="toggleCustomReportReason(this.value)" 
                class="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-xl outline-none focus:border-amber-400">
                <option value="Trù ẻo / Nói xỏ / Ngữ cảnh tiêu cực">☠️ Trù ẻo / Nói xỏ / Ngữ cảnh tiêu cực</option>
                <option value="Bạo lực ngôn từ / Chửi thề">🤬 Bạo lực ngôn từ / Chửi thề</option>
                <option value="Bắt nạt / Xúc phạm cá nhân">🎯 Bắt nạt / Xúc phạm cá nhân</option>
                <option value="Thông tin sai sự thật / Bóc phốt">⚠️ Thông tin sai sự thật / Bóc phốt</option>
                <option value="Spam / Nội dung rác">🔄 Spam / Nội dung rác</option>
                <option value="Lý do khác">✍️ Lý do khác...</option>
            </select>

            <textarea id="report-custom-reason" placeholder="Nhập chi tiết lý do vi phạm của bạn tại đây..." 
                class="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-xl outline-none focus:border-amber-400 h-20 hidden text-xs"></textarea>
        </div>

        <button onclick="submitReportMessage()" class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg">
            <i class="fa-solid fa-paper-plane"></i>
            <span>Gửi Báo Cáo Tới Ban Quản Trị</span>
        </button>
    `;
    modal.classList.remove('hidden');
};

window.toggleCustomReportReason = function(val) {
    const customInput = document.getElementById('report-custom-reason');
    if (customInput) customInput.classList.toggle('hidden', val !== "Lý do khác");
};

window.submitReportMessage = function() {
    if (!activeReportMsgId) return;
    const msg = kindnessMessages.find(m => String(m.id) === String(activeReportMsgId));
    if (!msg) return;

    const select = document.getElementById('report-reason-select');
    const customText = document.getElementById('report-custom-reason');

    let finalReason = select ? select.value : "Vi phạm quy tắc";
    if (finalReason === "Lý do khác" && customText && customText.value.trim()) {
        finalReason = customText.value.trim();
    }

    if (!Array.isArray(msg.reports)) msg.reports = [];

    const reporterName = getCurrentUserName();
    msg.reports.push({ reporter: reporterName, reason: finalReason });

    updateMessageInCloudOrLocal(activeReportMsgId, { reports: msg.reports });
    closeKindnessModal();
    renderZaloFeed();
    showKindnessStatus("🚩 Báo cáo đã được ghi nhận và gửi tới Thầy Cô / Admin!", "text-amber-300");
};

window.showReportDetailModal = function(id) {
    const msg = kindnessMessages.find(m => String(m.id) === String(id));
    if (!msg) return;

    if (!Array.isArray(msg.reports)) msg.reports = [];

    const isAdmin = typeof checkIsAdmin === 'function' ? checkIsAdmin() : false;
    const modal = document.getElementById('kindness-modal');
    const body = document.getElementById('kindness-modal-body');
    if (!modal || !body) return;

    if (isAdmin) {
        body.innerHTML = `
            <h3 class="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-shield-halved text-amber-500"></i>
                <span>Chi tiết báo cáo [ADMIN REVIEW] (${msg.reports.length})</span>
            </h3>
            <p class="text-xs text-slate-400 mb-3 italic">"${escapeHTML(msg.content)}"</p>
            <div class="max-h-48 overflow-y-auto space-y-2 custom-scroll">
                ${msg.reports.length > 0 ? msg.reports.map(r => `
                    <div class="bg-slate-950 p-2.5 rounded-xl border border-amber-500/30 text-xs text-slate-200 space-y-1">
                        <div class="flex items-center justify-between text-amber-300 font-bold">
                            <span>👤 ${escapeHTML(r.reporter)}</span>
                        </div>
                        <div class="text-slate-300 italic">"Lý do: ${escapeHTML(r.reason)}"</div>
                    </div>
                `).join('') : '<div class="text-xs text-slate-500 italic text-center py-4">Chưa có lượt báo cáo nào.</div>'}
            </div>
            <button onclick="handleDeleteMessageByAdmin('${msg.id}'); closeKindnessModal();" class="w-full mt-3 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 rounded-xl transition text-xs cursor-pointer">
                🗑️ Xoá Ngay Bài Viết Vi Phạm Này
            </button>
        `;
    } else {
        body.innerHTML = `
            <h3 class="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                <i class="fa-solid fa-flag text-amber-500"></i>
                <span>Thông tin kiểm duyệt</span>
            </h3>
            <p class="text-xs text-slate-400 mb-3 italic">"${escapeHTML(msg.content)}"</p>
            <div class="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 text-xs text-slate-200 text-center space-y-2">
                <p class="text-sm font-black text-amber-300">
                    🚩 Thông điệp này hiện có ${msg.reports.length} lượt báo cáo
                </p>
                <p class="text-[11px] text-slate-400">
                    Danh tính người báo cáo được hệ thống bảo mật hoàn toàn.
                </p>
            </div>
        `;
    }

    modal.classList.remove('hidden');
};

window.showReportListModal = function() {
    const modal = document.getElementById('kindness-modal');
    const body = document.getElementById('kindness-modal-body');
    if (!modal || !body) return;

    const reportedMsgs = kindnessMessages.filter(m => Array.isArray(m.reports) && m.reports.length > 0);

    if (reportedMsgs.length === 0) {
        body.innerHTML = `<div class="text-center text-xs text-emerald-400 py-6">🎉 Hiện tại không có lời chúc nào bị báo cáo!</div>`;
    } else {
        body.innerHTML = `
            <h3 class="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>Danh sách nội dung bị học sinh báo cáo (${reportedMsgs.length})</span>
            </h3>
            <div class="max-h-64 overflow-y-auto space-y-3 custom-scroll">
                ${reportedMsgs.map(m => `
                    <div class="bg-slate-950 p-3 rounded-2xl border border-rose-500/30 text-xs space-y-1.5">
                        <div class="font-bold text-cyan-400">${escapeHTML(m.sender)} ➔ ${escapeHTML(m.receiver)}</div>
                        <div class="text-slate-200 italic">"${escapeHTML(m.content)}"</div>
                        <div class="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                            <strong>Lý do báo cáo (${m.reports.length} lượt):</strong>
                            ${m.reports.map(r => `<div>• ${escapeHTML(r.reporter)}: ${escapeHTML(r.reason)}</div>`).join('')}
                        </div>
                        <button onclick="handleDeleteMessageByAdmin('${m.id}'); closeKindnessModal();" class="w-full mt-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-1.5 rounded-xl transition text-xs cursor-pointer">
                            🗑️ Xoá Ngay Lời Chúc Này
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }
    modal.classList.remove('hidden');
};

function countTotalReports() {
    return kindnessMessages.reduce((total, m) => total + (Array.isArray(m.reports) ? m.reports.length : 0), 0);
}

function closeKindnessModal() {
    const modal = document.getElementById('kindness-modal');
    if (modal) modal.classList.add('hidden');
}

window.handleDeleteMessageByAdmin = function(id) {
    if (confirm("⚠️ [ADMIN]: Xác nhận xoá lời chúc này khỏi hệ thống?")) {
        deleteMessageFromCloudOrLocal(id);
    }
};

window.handleSendKindnessMessage = function() {
    const input = document.getElementById('kindness-input');
    const receiverInput = document.getElementById('kindness-receiver');
    const hashtagSelect = document.getElementById('kindness-hashtag');

    if (!input || !input.value.trim()) {
        showKindnessStatus("⚠️ Vui lòng nhập nội dung lời chúc trước khi gửi nhé!", "text-amber-400");
        return;
    }

    const content = input.value.trim();
    const receiver = receiverInput && receiverInput.value.trim() ? receiverInput.value.trim() : "Tất cả bạn bè";
    const hashtag = hashtagSelect ? hashtagSelect.value : "#LanTỏa";

    if (content.length < 6) {
        showKindnessStatus("⚠️ Lời chúc quá ngắn! Hãy nhập từ 6 ký tự trở lên.", "text-amber-400");
        return;
    }

    const strictToxicKeywords = [
        "chet", "chết", "tu tu", "tự tử", "danh", "đánh", "giet", "giết", "cut", "cút", "bien", "biến",
        "dm", "đm", "vkl", "vcl", "cl", "ngu", "oc dog", "óc chó", "cho", "chó", "beo", "béo", "map", "mập",
        "lon", "lồn", "cac", "cặc", "buoi", "bồi", "boc phot", "bóc phốt",
        "chau ong ba", "chầu ông bà", "di chau", "đi chầu", "dang huong", "dâng hương", 
        "dang xuat", "đăng xuất", "ngam ga", "ngắm gà", "xanh co", "xanh cỏ", "ve voi chua", "về với chúa"
    ];

    const lowerContent = content.toLowerCase();
    const hasForbiddenWord = strictToxicKeywords.some(word => lowerContent.includes(word));

    if (hasForbiddenWord) {
        showKindnessStatus("❌ AI Phát hiện nội dung mang ý nghĩa tiêu cực/không phù hợp. Lời chúc bị từ chối đăng!", "text-rose-400");
        return;
    }

    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const timeStr = today.toTimeString().substring(0, 5);

    const newMessage = {
        sender: getCurrentUserName(),
        receiver: receiver,
        content: content,
        aiComment: "🤖 AI: ✨ Lời chúc tuyệt vời!",
        likes: [],
        reports: [],
        hashtag: hashtag,
        date: dateStr,
        time: timeStr,
        createdAt: Date.now()
    };

    // ĐẨY BÀI NÀY LÊN CLOUD FIRESTORE
    saveMessageToCloudOrLocal(newMessage);

    if (typeof addScore === 'function') addScore(1);

    input.value = '';
    if (receiverInput) receiverInput.value = '';
};

function showKindnessStatus(msg, textClass) {
    const statusDiv = document.getElementById('kindness-status');
    if (statusDiv) {
        statusDiv.className = `mt-1 font-bold ${textClass}`;
        statusDiv.innerText = msg;
        statusDiv.classList.remove('hidden');
    }
}

function formatDateDisplay(dateString) {
    const [year, month, day] = dateString.split('-');
    return `Ngày ${day}/${month}/${year}`;
}

function escapeHTML(value) {
    return String(value || '')
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// LẮNG NGHE ĐỒNG BỘ NẾU CHẠY OFFLINE
window.addEventListener('storage', function(e) {
    if (e.key === 'kindness_sync_trigger' || e.key === 'kindness_messages_data') {
        if (!window.db) {
            loadFromLocalStorage();
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        initKindnessRealtimeListener();
        if (typeof window.renderKindnessModule === 'function') {
            window.renderKindnessModule();
        }
    }, 300);
});