// js/aiChatWidget.js

function toggleAIChat() {
    const box = document.getElementById("ai-chat-box");

    if (!box) {
        console.error("Không tìm thấy #ai-chat-box");
        return;
    }

    box.classList.toggle("hidden");
}
// Bắt sự kiện nhấn phím Enter để gửi tin nhắn nhanh
document.addEventListener("DOMContentLoaded", () => {
    const aiChatInput = document.getElementById("ai-chat-input");
    if (aiChatInput) {
        aiChatInput.addEventListener("keydown", function(event) {
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
    if (!input || !container) return;
    
    const text = input.value.trim();
    if (!text) return;

    // Hiển thị tin nhắn người dùng
    container.innerHTML += `<div class="bg-indigo-900/60 p-2 rounded-xl text-white text-right ml-6">${text}</div>`;
    input.value = "";
    container.scrollTop = container.scrollHeight;

    // Gọi hàm askClassAI từ file AIService.js
    const reply = typeof askClassAI === 'function' ? await askClassAI(text) : "Trạm AI đang ngoại tuyến!";

    // Hiển thị tin nhắn AI trả lời
    container.innerHTML += `<div class="bg-slate-800 p-2 rounded-xl text-slate-200 mr-6">${reply}</div>`;
    container.scrollTop = container.scrollHeight;
}