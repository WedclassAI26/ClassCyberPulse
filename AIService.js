// Dùng lại mã key Groq bắt đầu bằng gsk_ của bạn ở đây
const GROQ_API_KEY = "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"; 

async function askClassAI(promptText) {
    // Endpoint của Groq API (dùng model llama3 hoặc tương tự)
    const url = "https://api.groq.com/openai/v1/chat/completions";
    
   const systemInstruction = "Bạn là chuyên gia tâm lý học đường và cố vấn đạo đức số sắc sảo của ClassCyberPulse. Lời khuyên phải thực tế, sắc sảo, mang tính định hướng tích cực và phù hợp với hoàn cảnh cảm xúc của học sinh. Tuyệt đối lịch sự, ấm áp, văn minh, nói ngắn gọn, súc tích (từ 1 đến 2 câu), không dùng từ ngữ cợt nhả, hỗn láo, sến súa hay tiếng lóng. Luôn linh hoạt thấu cảm sâu sắc và truyền năng lượng tích cực với phong thái chuẩn mực, tinh tế.";

    const data = {
        model: "llama-3.3-70b-versatile", // Hoặc model tương đương đang hoạt động tốt trên Groq
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
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (result.error) {
            console.error("Lỗi từ Groq API:", result.error.message);
            return `Lỗi AI: ${result.error.message}`;
        }
        
        if (result.choices && result.choices.length > 0) {
            return result.choices[0].message.content;
        } else {
            return "AI đang bận một chút, bạn thử lại sau nhé!";
        }
    } catch (error) {
        console.error("Lỗi kết nối AI:", error);
        return "Không thể kết nối tới trạm AI vũ trụ lúc này.";
    }
}