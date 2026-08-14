const defaultMessages = [
    {
        sender: "Từ Ẩn danh ➔ Lớp 12C3",
        text: "Chúc anh chị 12C3 ôn thi THPT Quốc gia thật tốt và luôn giữ vững tinh thần nhé!",
        color: "indigo"
    },
    {
        sender: "Từ Lớp 11A1 ➔ Lớp 10A2",
        text: "Chào mừng các em 10A2 gia nhập hành trình lan tỏa năng lượng tích cực!",
        color: "emerald"
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

        card.className = `${colorClass} border p-4 rounded-xl animate-fade-in`;
        card.innerHTML = `
            <span class="text-xs font-bold">${msg.sender}</span>
            <p class="text-sm text-slate-200 mt-2">"${msg.text}"</p>
        `;
        wall.appendChild(card);
    });
}

// Hàm gửi lời chúc có màng lọc từ ngữ AI NLP
function postKindnessMessage() {
    const input = document.getElementById('wall-input');
    const val = input.value.trim();
    if (!val) return;

    // Lọc từ độc hại
    const toxicWords = ["chửi", "toxic", "ghét", "xấu", "ngu", "đần", "xấu tính"];
    const isToxic = toxicWords.some(word => val.toLowerCase().includes(word));

    if (isToxic) {
        alert("⚠️ Hệ thống AI NLP phát hiện từ ngữ chưa phù hợp. Vui lòng điều chỉnh để lan tỏa năng lượng tích cực!");
        return;
    }

    // Lưu lời chúc mới vào LocalStorage
    const messages = getMessages();
    messages.unshift({
        sender: "Từ Lớp 11A1 ➔ Toàn trường",
        text: val,
        color: "purple"
    });
    localStorage.setItem('class_cyber_pulse_messages', JSON.stringify(messages));

    // Cộng +5 CCS cho lớp 11A1
    const classes = getClassesData();
    const myClass = classes.find(c => c.id === "11a1");
    if (myClass) {
        myClass.ccs += 5;
        myClass.messagesCount += 1;
        saveClassesData(classes);
    }

    input.value = "";
    loadKindnessMessages();
    alert("✨ Lời chúc đã được gửi thành công! Lớp 11A1 nhận +5 điểm CCS.");
}

// Tự động nạp tin nhắn khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    loadKindnessMessages();
});