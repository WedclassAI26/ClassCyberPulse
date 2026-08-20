// ==========================================
// MÔ-ĐUN: TRẠM TỬ TẾ - WALL.JS GỐC
// ==========================================

const defaultMessages = [
    {
        sender: "Từ Ẩn danh ➔ Lớp 12C3",
        text: "Chúc anh chị 12C3 ôn thi THPT Quốc gia thật tốt và luôn giữ vững tinh thần nhé!",
        color: "indigo",
        aiFeedback: "✨ Một lời chúc tuyệt vời! Năng lượng tích cực sẽ lan tỏa đến các anh chị."
    },
    {
        sender: "Từ Lớp 11A1 ➔ Lớp 10A2",
        text: "Chào mừng các em 10A2 gia nhập hành trình lan tỏa năng lượng tích cực!",
        color: "emerald",
        aiFeedback: "🌟 Chào mừng đầy ấm áp và gắn kết tình cảm học đường!"
    }
];

// Lấy danh sách tin nhắn từ LocalStorage
function getMessages() {
    try {
        const saved = localStorage.getItem('class_cyber_pulse_messages');
        return saved ? JSON.parse(saved) : defaultMessages;
    } catch (e) {
        return defaultMessages;
    }
}

// Hiển thị danh sách tin nhắn
function loadKindnessMessages() {
    const wall = document.getElementById('wall-messages') || document.getElementById('kindness-module-container');
    if (!wall) return;

    const messages = getMessages();
    
    // Khung nhập lời chúc chuẩn giao diện Trạm Tử Tế
    let html = `
        <div class="bg-slate-900/90 border border-cyan-500/40 p-4 rounded-3xl backdrop-blur-xl shadow-2xl mb-6">
            <h3 class="text-sm font-black text-white flex items-center gap-2 mb-3">
                <i class="fa-solid fa-heart-circle-bolt text-rose-400 text-base"></i>
                <span>Gửi Lời Chúc Tử Tế (Trạm Tử Tế)</span>
            </h3>
            <div class="flex gap-3">
                <input type="text" id="wall-input" placeholder="Nhập lời nhắn gửi tích cực tới bạn bè, thầy cô..." 
                    class="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-xs text-white px-4 py-3 rounded-2xl outline-none">
                <button type="button" onclick="postKindnessMessage()" 
                    class="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0">
                    <i class="fa-solid fa-paper-plane text-xs"></i>
                    <span>Gửi (+5 CCS)</span>
                </button>
            </div>
        </div>
        <div id="messages-list-container" class="space-y-3"></div>
    `;
    
    wall.innerHTML = html;
    const listContainer = document.getElementById('messages-list-container');
    if (!listContainer) return;

    messages.forEach(msg => {
        const card = document.createElement('div');
        const colorClass = msg.color === 'purple' 
            ? 'bg-purple-900/30 border-purple-500/30 text-purple-300' 
            : msg.color === 'emerald'
            ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-300'
            : 'bg-indigo-900/30 border-indigo-500/30 text-indigo-300';

        card.className = `${colorClass} border p-4 rounded-xl animate-fade-in mb-3 shadow-lg`;
        card.innerHTML = `
            <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-bold">${escapeHTML(msg.sender)}</span>
            </div>
            <p class="text-sm text-slate-200 mt-1">"${escapeHTML(msg.text)}"</p>
            ${msg.aiFeedback ? `
                <div class="mt-3 p-2.5 bg-slate-950/60 rounded-lg border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-2">
                    <i class="fa-solid fa-robot text-sm text-cyan-400 mt-0.5"></i>
                    <div><strong>AI Hành Tinh:</strong> ${escapeHTML(msg.aiFeedback)}</div>
                </div>
            ` : ''}
        `;
        listContainer.appendChild(card);
    });
}

// Hàm hỗ trợ render tương thích với switchTab
window.renderKindnessModule = function(containerId) {
    loadKindnessMessages();
};

// Hàm gửi lời chúc kết hợp AI phân tích thực tế
async function postKindnessMessage() {
    const input = document.getElementById('wall-input');
    if (!input) return;
    
    const val = input.value.trim();
    if (!val) {
        alert("⚠️ Vui lòng nhập nội dung lời chúc trước khi gửi!");
        return;
    }

    const btnSubmit = document.querySelector('button[onclick="postKindnessMessage()"]');
    const oldBtnText = btnSubmit ? btnSubmit.innerHTML : "";
    if (btnSubmit) {
        btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> AI đang kiểm duyệt...`;
        btnSubmit.disabled = true;
    }

    let aiFeedback = "";
    let isToxic = false;

    if (typeof askClassAI === 'function') {
        try {
            const prompt = `Phân tích câu nói sau của học sinh: "${val}". 
            1. Kiểm tra xem có chứa từ ngữ độc hại, thô tục, xúc phạm hay không? Nếu có, hãy trả về kết quả bắt đầu bằng chữ "VIOLATION". 
            2. Nếu nội dung lành mạnh, tích cực, hãy viết một lời nhận xét, khen ngợi hoặc động viên ngắn gọn (tối đa 2 câu) để truyền cảm hứng học đường.`;
            
            const responseText = await askClassAI(prompt);
            
            if (responseText && responseText.includes("VIOLATION")) {
                isToxic = true;
            } else {
                aiFeedback = responseText;
            }
        } catch (err) {
            console.error("Lỗi AI kiểm duyệt:", err);
            aiFeedback = "✨ Lời nhắn ý nghĩa góp phần xây dựng văn hóa học đường văn minh!";
        }
    } else {
        aiFeedback = "✨ Lời nhắn lan tỏa năng lượng tích cực!";
    }

    if (btnSubmit) {
        btnSubmit.innerHTML = oldBtnText;
        btnSubmit.disabled = false;
    }

    if (isToxic) {
        alert("⚠️ Hệ thống AI phát hiện từ ngữ chưa phù hợp hoặc thiếu văn minh. Vui lòng điều chỉnh để lan tỏa năng lượng tích cực!");
        return;
    }

    const messages = getMessages();
    messages.unshift({
        sender: "Từ Lớp 11A1 ➔ Toàn trường",
        text: val,
        color: "purple",
        aiFeedback: aiFeedback
    });
    localStorage.setItem('class_cyber_pulse_messages', JSON.stringify(messages));

    if (typeof addScore === 'function') {
        addScore(5);
    }

    input.value = "";
    loadKindnessMessages();
    alert("✨ Lời chúc đã được AI duyệt và đăng thành công! Lớp nhận +5 điểm CCS.");
}

function escapeHTML(str) {
    return String(str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Tự động nạp tin nhắn khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    loadKindnessMessages();
});