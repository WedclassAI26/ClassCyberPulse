// js/aiChatWidget.js

function toggleAIChat() {
    const box = document.getElementById("ai-chat-box");

    if (!box) {
        console.error("Không tìm thấy #ai-chat-box");
        return;
    }

    box.classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", () => {

    const chatToggleBtn = document.getElementById("ai-chat-toggle");

    if (chatToggleBtn) {
        chatToggleBtn.addEventListener("touchend", (e) => {
            e.preventDefault();
            toggleAIChat();
        }, { passive: false });
    }

    const aiChatInput = document.getElementById("ai-chat-input");

    if (aiChatInput) {
        aiChatInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                sendMsgToAI();
            }
        });
    }
});


async function sendMsgToAI() {

    const input = document.getElementById("ai-chat-input");
    const container = document.getElementById("ai-chat-messages");

    if (!input || !container) {
        console.error("Không tìm thấy ô chat");
        return;
    }

    const text = input.value.trim();

    if (!text) return;

    // Hiển thị tin nhắn người dùng
    const userMessage = document.createElement("div");
    userMessage.className =
        "bg-indigo-900/60 p-2 rounded-xl text-white text-right ml-6";
    userMessage.textContent = text;

    container.appendChild(userMessage);

    input.value = "";
    container.scrollTop = container.scrollHeight;


    // Chờ AIService.js nếu điện thoại tải chậm
    let attempts = 0;

    while (typeof window.askClassAI !== "function" && attempts < 30) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }


    // Kiểm tra AIService
    if (typeof window.askClassAI !== "function") {

        console.error("AIService.js chưa được tải trên thiết bị này.");

        const errorMessage = document.createElement("div");
        errorMessage.className =
            "bg-slate-800 p-2 rounded-xl text-slate-200 mr-6";

        errorMessage.textContent =
            "Không tải được Trạm AI. Vui lòng tải lại trang rồi thử lại.";

        container.appendChild(errorMessage);
        container.scrollTop = container.scrollHeight;

        return;
    }


    // Hiển thị trạng thái đang xử lý
    const loadingMessage = document.createElement("div");
    loadingMessage.className =
        "bg-slate-800 p-2 rounded-xl text-slate-400 mr-6";
    loadingMessage.textContent = "AI đang suy nghĩ...";

    container.appendChild(loadingMessage);
    container.scrollTop = container.scrollHeight;


    try {

        const reply = await window.askClassAI(text);

        loadingMessage.remove();

        const aiMessage = document.createElement("div");
        aiMessage.className =
            "bg-slate-800 p-2 rounded-xl text-slate-200 mr-6";

        aiMessage.textContent =
            reply || "AI chưa có câu trả lời.";

        container.appendChild(aiMessage);

    } catch (error) {

        console.error("Lỗi sendMsgToAI:", error);

        loadingMessage.remove();

        const errorMessage = document.createElement("div");
        errorMessage.className =
            "bg-slate-800 p-2 rounded-xl text-slate-200 mr-6";

        errorMessage.textContent =
            "Không thể kết nối Trạm AI lúc này. Bạn thử lại nhé.";

        container.appendChild(errorMessage);
    }

    container.scrollTop = container.scrollHeight;
}