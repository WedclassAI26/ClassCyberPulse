async function sendMsgToAI() {
    const input = document.getElementById("ai-chat-input");
    const container = document.getElementById("ai-chat-messages");

    if (!input || !container) return;

    const text = input.value.trim();
    if (!text) return;

    // Hiển thị tin nhắn người dùng
    container.innerHTML += `
        <div class="bg-indigo-900/60 p-2 rounded-xl text-white text-right ml-6">
            ${text}
        </div>
    `;

    input.value = "";
    container.scrollTop = container.scrollHeight;

    // Nếu AIService.js chưa được tải, tải lại trực tiếp
    if (typeof window.askClassAI !== "function") {

        try {
            await new Promise((resolve, reject) => {

                const oldScript = document.querySelector(
                    'script[src*="AIService.js"]'
                );

                // Nếu script đã tồn tại nhưng chưa tạo hàm,
                // tải lại một bản mới, tránh cache điện thoại
                const script = document.createElement("script");

                script.src = "js/AIService.js?v=" + Date.now();

                script.onload = resolve;

                script.onerror = () => {
                    reject(new Error("Không tải được AIService.js"));
                };

                document.head.appendChild(script);
            });

        } catch (error) {

            console.error("Không tải được AIService.js:", error);

            container.innerHTML += `
                <div class="bg-slate-800 p-2 rounded-xl text-slate-200 mr-6">
                    Không tải được Trạm AI trên thiết bị này.
                </div>
            `;

            container.scrollTop = container.scrollHeight;
            return;
        }
    }

    // Kiểm tra lại sau khi tải
    if (typeof window.askClassAI !== "function") {

        console.error("AIService.js đã tải nhưng askClassAI không tồn tại.");

        container.innerHTML += `
            <div class="bg-slate-800 p-2 rounded-xl text-slate-200 mr-6">
                Trạm AI chưa sẵn sàng, bạn thử tải lại trang nhé.
            </div>
        `;

        container.scrollTop = container.scrollHeight;
        return;
    }

    // Đang xử lý
    const loading = document.createElement("div");
    loading.className =
        "bg-slate-800 p-2 rounded-xl text-slate-400 mr-6";
    loading.textContent = "AI đang suy nghĩ...";

    container.appendChild(loading);
    container.scrollTop = container.scrollHeight;

    try {

        const reply = await window.askClassAI(text);

        loading.remove();

        container.innerHTML += `
            <div class="bg-slate-800 p-2 rounded-xl text-slate-200 mr-6">
                ${reply}
            </div>
        `;

    } catch (error) {

        console.error("Lỗi AI:", error);

        loading.remove();

        container.innerHTML += `
            <div class="bg-slate-800 p-2 rounded-xl text-slate-200 mr-6">
                Không thể kết nối Trạm AI lúc này.
            </div>
        `;
    }

    container.scrollTop = container.scrollHeight;
}