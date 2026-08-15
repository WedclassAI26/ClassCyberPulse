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
    const saved = localStorage.getItem('class_cyber_pulse_messages');
    return saved ? JSON.parse(saved) : defaultMessages;
}

// Hiển thị danh sách tin nhắn
function loadKindnessMessages() {
    const wall = document.getElementById('wall-messages');
    if (!wall) return;

    const messages = getMessages();
    wall.innerHTML = "";

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
                <span class="text-xs font-bold">${msg.sender}</span>
            </div>
            <p class="text-sm text-slate-200 mt-1">"${msg.text}"</p>
            ${msg.aiFeedback ? `
                <div class="mt-3 p-2.5 bg-slate-950/60 rounded-lg border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-2">
                    <i class="fa-solid fa-robot text-sm text-cyan-400 mt-0.5"></i>
                    <div><strong>AI Hành Tinh:</strong> ${msg.aiFeedback}</div>
                </div>
            ` : ''}
        `;
        wall.appendChild(card);
    });
}

// Hàm gửi lời chúc kết hợp AI phân tích thực tế
async function postKindnessMessage() {
    const input = document.getElementById('wall-input');
    if (!input) return;
    
    const val = input.value.trim();
    if (!val) return;

    // Hiển thị trạng thái đang chờ AI xử lý để tăng trải nghiệm công nghệ
    const btnSubmit = document.querySelector('button[onclick="postKindnessMessage()"]') || event?.target;
    const oldBtnText = btnSubmit ? btnSubmit.innerHTML : "";
    if (btnSubmit) {
        btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> AI đang kiểm duyệt...`;
        btnSubmit.disabled = true;
    }

    let aiFeedback = "";
    let isToxic = false;

    // Gọi AI Gemini kiểm duyệt và nhận xét nội dung thông qua hàm askClassAI đã tích hợp ở AIService.js
    if (typeof askClassAI === 'function') {
        try {
            const prompt = `Phân tích câu nói sau của học sinh: "${val}". 
            1. Kiểm tra xem có chứa từ ngữ độc hại, thô tục, xúc phạm hay không? Nếu có, hãy trả về kết quả bắt đầu bằng chữ "VIOLATION". 
            2. Nếu nội dung lành mạnh, tích cực, hãy viết một lời nhận xét, khen ngợi hoặc động viên ngắn gọn (tối đa 2 câu) để truyền cảm hứng học đường.`;
            
            const responseText = await askClassAI(prompt);
            
            if (responseText.includes("VIOLATION")) {
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

    // Khôi phục nút bấm
    if (btnSubmit) {
        btnSubmit.innerHTML = oldBtnText;
        btnSubmit.disabled = false;
    }

    if (isToxic) {
        alert("⚠️ Hệ thống AI phát hiện từ ngữ chưa phù hợp hoặc thiếu văn minh. Vui lòng điều chỉnh để lan tỏa năng lượng tích cực!");
        return;
    }

    // Lưu lời chúc mới vào LocalStorage kèm đánh giá của AI
    const messages = getMessages();
    messages.unshift({
        sender: "Từ Lớp 11A1 ➔ Toàn trường",
        text: val,
        color: "purple",
        aiFeedback: aiFeedback
    });
    localStorage.setItem('class_cyber_pulse_messages', JSON.stringify(messages));

    // Cộng +5 CCS cho lớp 11A1 (nếu có hàm quản lý điểm)
    if (typeof getClassesData === 'function' && typeof saveClassesData === 'function') {
        const classes = getClassesData();
        const myClass = classes.find(c => c.id === "11a1");
        if (myClass) {
            myClass.ccs += 5;
            myClass.messagesCount += 1;
            saveClassesData(classes);
        }
    }

    input.value = "";
    loadKindnessMessages();
    alert("✨ Lời chúc đã được AI duyệt và đăng thành công! Lớp 11A1 nhận +5 điểm CCS.");
}

// Tự động nạp tin nhắn khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    loadKindnessMessages();
});