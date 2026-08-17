// ==========================================
// TRỢ LÝ AI CLASSCYBERPULSE
// ==========================================

function toggleAIChat() {
    const box = document.getElementById("ai-chat-box");

    if (!box) {
        console.error("Không tìm thấy #ai-chat-box");
        return;
    }

    box.classList.toggle("hidden");
}


// ==========================================
// GỬI TIN NHẮN CHO AI
// ==========================================

async function sendMsgToAI() {

    const input = document.getElementById("ai-chat-input");
    const container = document.getElementById("ai-chat-messages");

    if (!input || !container) {
        console.error("Không tìm thấy ô nhập hoặc khung chat.");
        return;
    }

    const text = input.value.trim();

    if (!text) return;


    // ==========================================
    // HIỂN THỊ TIN NHẮN NGƯỜI DÙNG
    // ==========================================

    const userMsg = document.createElement("div");

    userMsg.className =
        "bg-indigo-900/60 p-2 rounded-xl text-white text-right ml-6";

    userMsg.textContent = text;

    container.appendChild(userMsg);

    input.value = "";

    container.scrollTop = container.scrollHeight;


    // ==========================================
    // CÂU CHÀO ĐẶC BIỆT
    // Giữ nguyên câu trả lời bạn thích
    // ==========================================

    const greetingRegex =
        /^(chào|chao|xin chào|xin chao|hello|hi)$/i;

    if (greetingRegex.test(text)) {

        const aiMsg = document.createElement("div");

        aiMsg.className =
            "bg-slate-800 p-2 rounded-xl text-slate-200 mr-6";

        aiMsg.textContent =
            "Chào bạn, ClassCyberPulse luôn sẵn sàng lắng nghe và chia sẻ cùng bạn. Nếu có điều gì cần trao đổi hoặc hỗ trợ, đừng ngần ngại chia sẻ nhé!";

        container.appendChild(aiMsg);

        container.scrollTop = container.scrollHeight;

        return;
    }


    // ==========================================
    // KIỂM TRA AI SERVICE
    // ==========================================

    if (typeof askClassAI !== "function") {

        console.error("AIService.js chưa được tải.");

        const errorMsg = document.createElement("div");

        errorMsg.className =
            "bg-slate-800 p-2 rounded-xl text-red-300 mr-6";

        errorMsg.textContent =
            "Không thể kết nối Trạm AI lúc này.";

        container.appendChild(errorMsg);

        container.scrollTop = container.scrollHeight;

        return;
    }


    // ==========================================
    // HIỂN THỊ ĐANG SUY NGHĨ
    // ==========================================

    const loadingMsg = document.createElement("div");

    loadingMsg.className =
        "bg-slate-800 p-2 rounded-xl text-slate-400 mr-6";

    loadingMsg.textContent =
        "AI đang suy nghĩ...";

    container.appendChild(loadingMsg);

    container.scrollTop = container.scrollHeight;


    // ==========================================
    // GỌI GROQ AI
    // ==========================================

    try {

        const reply = await askClassAI(text);

        loadingMsg.remove();


        const aiMsg = document.createElement("div");

        aiMsg.className =
            "bg-slate-800 p-2 rounded-xl text-slate-200 mr-6";

        aiMsg.textContent =
            reply || "AI chưa có câu trả lời.";

        container.appendChild(aiMsg);

    } catch (error) {

        console.error("Lỗi khi gọi AI:", error);

        loadingMsg.remove();


        const errorMsg = document.createElement("div");

        errorMsg.className =
            "bg-slate-800 p-2 rounded-xl text-red-300 mr-6";

        errorMsg.textContent =
            "Không thể kết nối Trạm AI lúc này.";

        container.appendChild(errorMsg);
    }


    container.scrollTop = container.scrollHeight;
}


// ==========================================
// SỰ KIỆN NHẬP PHÍM ENTER
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("ai-chat-input");

    if (!input) {
        console.warn("Không tìm thấy #ai-chat-input");
        return;
    }

    input.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMsgToAI();
        }
    });
});