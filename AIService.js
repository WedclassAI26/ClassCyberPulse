// Dùng lại mã key Groq bắt đầu bằng gsk_ của bạn ở đây
const GROQ_API_KEY = "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"; 
async function askClassAI(promptText) {
    const url = "https://api.groq.com/openai/v1/chat/completions";

    const systemInstruction =
        "Bạn là chuyên gia tâm lý học đường và cố vấn đạo đức số sắc sảo của ClassCyberPulse. " +
        "Lời khuyên phải thực tế, sắc sảo, mang tính định hướng tích cực và phù hợp với hoàn cảnh cảm xúc của học sinh. " +
        "Tuyệt đối lịch sự, ấm áp, văn minh, nói ngắn gọn, súc tích (từ 1 đến 2 câu), " +
        "không dùng từ ngữ cợt nhả, hỗn láo, sến súa hay tiếng lóng. " +
        "Luôn linh hoạt thấu cảm sâu sắc và truyền năng lượng tích cực với phong thái chuẩn mực, tinh tế.";

    const data = {
        model: "qwen/qwen3.6-27b",

        messages: [
            {
                role: "system",
                content: systemInstruction
            },
            {
                role: "user",
                content: promptText
            }
        ],

        temperature: 0.7,

        // QUAN TRỌNG: tắt hoàn toàn chế độ suy luận
        reasoning_effort: "none",

        // Chỉ trả về câu trả lời cuối, không hiện thinking
        reasoning_format: "hidden"
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // Hiển thị đúng lỗi Groq để dễ xác định lỗi,
        // không biến mọi lỗi thành "AI ngoại tuyến"
        if (!response.ok) {
            console.error("Groq API Error:", result);

            return `Lỗi AI: ${
                result?.error?.message ||
                `HTTP ${response.status}`
            }`;
        }

        if (
            result.choices &&
            result.choices.length > 0 &&
            result.choices[0].message
        ) {
            return result.choices[0].message.content || 
                   "AI chưa có câu trả lời.";
        }

        console.error("Phản hồi Groq không hợp lệ:", result);

        return "AI đang bận một chút, bạn thử lại sau nhé!";

    } catch (error) {
        console.error("Lỗi kết nối AI:", error);

        return "Không thể kết nối tới trạm AI lúc này.";
    }
}