// Mã khóa Groq
window.GROQ_API_KEY = "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";

async function askClassAI(promptText) {
    const url = "https://api.groq.com/openai/v1/chat/completions";

    const systemInstruction =
        "Bạn là chuyên gia tâm lý học đường và cố vấn đạo đức số sắc sảo của ClassCyberPulse. " +
        "Lời khuyên phải thực tế, tích cực, phù hợp cảm xúc học sinh, lịch sự, ấm áp, văn minh, " +
        "ngắn gọn từ 1 đến 2 câu, không dùng tiếng lóng, không cợt nhả, không sến súa.";

    const data = {
        model: "openai/gpt-oss-20b",
        messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: promptText }
        ],
        temperature: 0.7
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${window.GROQ_API_KEY}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Groq API Error:", result);
            return `Lỗi AI: ${result?.error?.message || `HTTP ${response.status}`}`;
        }

        return result?.choices?.[0]?.message?.content || "AI chưa có câu trả lời.";

    } catch (error) {
        console.error("Lỗi kết nối AI:", error);
        return "Không thể kết nối tới trạm AI lúc này.";
    }
}