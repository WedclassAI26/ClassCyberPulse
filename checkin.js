// NGÂN HÀNG TÌNH HUỐNG - THỬ THÁCH VĂN MINH MẠNG (CẬP NHẬT GIAO DIỆN GÓC CHUYÊN GIA)
const scenarioBank = [
    {
        id: 1,
        title: "TÌNH HUỐNG 1: BẠO LỰC MẠNG & ẢNH SƠ HỞ",
        question: "Một bài viết ẩn danh đăng hình ảnh sơ hở của bạn học trong trường nhằm mục đích chế giễu. Bạn sẽ ứng xử thế nào?",
        options: [
            { 
                text: "Bình luận 'Trời ơi xui vậy', thả icon Haha và viết: 'Khuyên thật lòng là gỡ bài đi không là bị kỷ luật đấy nha' để nhắc nhở tác giả.", 
                points: 10, 
                level: "Tiêu cực",
                expertAdvice: {
                    type: "vi-pham",
                    title: "⚠️ DÒNG ĐỜI XÔ ĐẨY HAY TỰ MÌNH LỌT HỐ?",
                    analysis: "Tưởng là 'nhắc nhở thân thiện', nhưng thả icon Haha và comment đùa giỡn chính là hành vi 'đổ thêm dầu vào lửa'!",
                    law: "<b>🚨 Căn cứ pháp lý:</b> Xúc phạm danh dự, nhân phẩm người khác (Điều 8 - Luật An ninh mạng). Có thể bị phạt nhẹ từ 10 - 20 triệu VNĐ (Nghị định 15/2020) + combo Học bạ ghi nhận kỷ luật!",
                    consequence: "<b>Hậu quả:</b> Nạn nhân khủng hoảng tâm lý, còn bạn thì thành 'đồng phạm' trong mắt thầy cô.",
                    kindness: ""
                }
            },
            { 
                text: "Chụp màn hình gửi ngay vào nhóm chat riêng của hội bạn thân với tin nhắn: 'Vào xem nhanh không nó gỡ mất, tội nghiệp bạn này ghê'.", 
                points: 10, 
                level: "Tò mò",
                expertAdvice: {
                    type: "chua-tu-te",
                    title: "👀 'HÓNG BIẾN' TINH TẾ HAY TẬP LÀM TỔN THƯƠNG?",
                    analysis: "Gửi vào group kín để 'tội nghiệp' nghe rất thương cảm, nhưng thực chất là bạn đang tự biến nhóm bạn mình thành cái chợ phát tán ảnh nhạy cảm!",
                    law: "<b>🚨 Cảnh báo nhẹ:</b> Xâm phạm đời tư cá nhân. Nhóm chat kín đến mấy cũng dễ bị rò rỉ, lúc đó 'tội nghiệp' bạn sẽ biến thành 'tội lỗi' của chính mình đấy.",
                    consequence: "<b>Hậu quả:</b> Làm lan truyền thông tin độc hại, đánh mất sự tin tưởng của bạn bè.",
                    kindness: ""
                }
            },
            { 
                text: "Thấy bất bình nhưng nghĩ đây là chuyện riêng của bạn đó, mình không liên quan nên im lặng lướt qua để tránh rắc rối.", 
                points: 10, 
                level: "Thụ động",
                expertAdvice: {
                    type: "chua-tu-te",
                    title: "🛡️ THIÊN THẦN AN TOÀN NƯỚC ĐÔI",
                    analysis: "Bạn rất giỏi tự bảo vệ mình khỏi rắc rối. Nhưng im lặng trước cái xấu giống như thấy nhà bạn bị cháy mà giả vờ không ngửi thấy mùi khói vậy!",
                    law: "",
                    consequence: "<b>Hậu quả:</b> Nạn nhân bị cô lập hoàn toàn giữa đám đông vô cảm.",
                    kindness: "<b>💡 Lời khuyên nâng cấp:</b> Chỉ cần bấm thêm nút 'Report' là bạn đã nâng cấp từ 'Kẻ đứng nhìn' thành 'Hiệp sĩ mạng' rồi!"
                }
            },
            { 
                text: "Sử dụng tính năng Báo cáo (Report) bài viết vi phạm, đồng thời nhắn tin riêng động viên và hướng dẫn bạn nạn nhân cách xử lý.", 
                points: 10, 
                level: "Văn minh",
                expertAdvice: {
                    type: "tu-te",
                    title: "🌟 TRÙM NGUYÊN TẮC - VIP PRO CÔNG DÂN SỐ!",
                    analysis: "10 điểm không có nhưng! Bạn không chỉ tỉnh táo dập tắt bài viết xấu mà còn truyền năng lượng tích cực cho bạn mình.",
                    law: "",
                    consequence: "",
                    kindness: "<b>🌈 GIÁ TRỊ VĂN MINH:</b> Bạn vừa cứu vãn tâm lý cho 1 con người, khẳng định EQ đỉnh cao, xây dựng hình ảnh Lãnh đạo tương lai!"
                }
            }
        ]
    },
    {
        id: 2,
        title: "TÌNH HUỐNG 2: TIN ĐỒN THẤT THIỆT",
        question: "Một Fanpage ẩn danh đăng thông tin giật gân, chưa kiểm chứng gây ảnh hưởng đến uy tín nhà trường. Bạn sẽ làm gì?",
        options: [
            { 
                text: "Bấm Chia sẻ (Share) bài viết lên trang cá nhân kèm dòng trạng thái: 'Mọi người nghĩ sao về vụ này? Thật hay giả vậy?' để cùng thảo luận.", 
                points: 10, 
                level: "Tò mò",
                expertAdvice: {
                    type: "vi-pham",
                    title: "📢 TỰ BIẾN TƯỜNG CÁ NHÂN THÀNH 'LOA PHÁT TIN GIẢ'",
                    analysis: "Dùng câu hỏi 'Thật hay giả' để Share bài thực ra chỉ là cớ để 'câu tương tác'. Hành vi này vô tình làm tin giả lan rộng nhanh gấp 10 lần!",
                    law: "<b>🚨 Căn cứ pháp lý:</b> Điều 16 Luật An ninh mạng & Điểm a K1 Điều 101 Nghị định 15/2020/NĐ-CP (Cung cấp, chia sẻ thông tin giả mạo, sai sự thật). Phạt tiền 10-20 triệu như chơi!",
                    consequence: "<b>Hậu quả:</b> Hạ thấp uy tín Nhà trường và gây hoang mang cho hàng trăm học sinh khác.",
                    kindness: ""
                }
            },
            { 
                text: "Viết bình luận chê trách nhà trường ngay dưới bài viết vì cho rằng 'Không có lửa làm sao có khói'.", 
                points: 10, 
                level: "Tiêu cực",
                expertAdvice: {
                    type: "vi-pham",
                    title: "🔥 'THÁI CỰC QUYỀN' BÀN PHÍM & BẪY AN NINH MẠNG",
                    analysis: "Quy chụp khi chưa có bằng chứng chính thức là thói quen cực kỳ nguy hiểm của 'anh hùng bàn phím'.",
                    law: "<b>🚨 Căn cứ pháp lý:</b> Vi phạm Luật An ninh mạng về xúc phạm uy tín cơ quan, tổ chức. Nhẹ thì viết bản kiểm điểm, nặng thì chịu trách nhiệm trước pháp luật!",
                    consequence: "<b>Hậu quả:</b> Tự làm xấu hồ sơ cá nhân và tiếp tay cho kẻ xấu phá hoại hình ảnh trường lớp.",
                    kindness: ""
                }
            },
            { 
                text: "Không chia sẻ, chủ động tìm đọc thông báo ở Kênh chính thức của trường/Đoàn trường và khuyên bạn bè dừng bàn tán.", 
                points: 10, 
                level: "Văn minh",
                expertAdvice: {
                    type: "tu-te",
                    title: "🧠 ĐẦU ÓC LẠNH - TRÁI TIM NÓNG",
                    analysis: "Áp dụng đúng chuẩn quy tắc S.I.FT (Dừng lại - Kiểm chứng - Tìm nguồn chuẩn). Tinh thần chủ động này đáng giá từng xu!",
                    law: "",
                    consequence: "",
                    kindness: "<b>🌈 GIÁ TRỊ VĂN MINH:</b> Giúp tập thể không mắc bẫy truyền thông bẩn, giữ gìn môi trường học đường lành mạnh!"
                }
            },
            { 
                text: "Đọc thấy hoang mang nhưng chọn cách làm lơ, không bình luận hay hỏi ai.", 
                points: 10, 
                level: "Thụ động",
                expertAdvice: {
                    type: "chua-tu-te",
                    title: "🫣 LẶNG LẼ TRONG BÓNG TỐI",
                    analysis: "Bạn chọn cách không dính dáng, nhưng sự hoang mang trong lòng vẫn chưa được giải quyết đúng không?",
                    law: "",
                    consequence: "<b>Hậu quả:</b> Tâm lý lo lắng kéo dài do tiếp nhận tin tiêu cực mà không verified (kiểm chứng).",
                    kindness: "<b>💡 Lời khuyên:</b> Lần sau hãy chủ động vào ngay Fanpage Đoàn trường để đọc tin chính thống cho yên tâm ngủ ngon nhé!"
                }
            }
        ]
    },
    {
        id: 3,
        title: "TÌNH HUỐNG 3: BÌNH LUẬN MIỆT KỲ (BODY SHAMING)",
        question: "Thấy một bạn học sinh lớp khác đăng ảnh cá nhân lên mạng và có một số bình luận chê bai ngoại hình gay gắt, bạn sẽ phản ứng thế thế nào?",
        options: [
            {
                text: "Hùa vào bấm like các bình luận chê bai vì thấy họ nói... cũng đúng sự thật và khá hài hước.",
                points: 10,
                level: "Tiêu cực",
                expertAdvice: {
                    type: "vi-pham",
                    title: "❌ HÙA THEO ĐÁM ĐÔNG - TỔN THƯƠNG SÂU SẮC",
                    analysis: "Việc hùa theo miệt thị ngoại hình (Body shaming) trên không gian mạng có sức sát thương tâm lý vô cùng lớn đối với nạn nhân, đặc biệt là lứa tuổi học trò.",
                    law: "<b>🚨 Căn cứ pháp lý:</b> Hành vi nhục mạ, lăng mạ người khác trên không gian mạng có thể bị xử phạt hành chính hoặc truy cứu trách nhiệm dân sự.",
                    consequence: "<b>Hậu quả:</b> Gây trầm cảm cho nạn nhân và để lại vết nhơ về đạo đức trong hồ sơ cá nhân của bạn.",
                    kindness: ""
                }
            },
            {
                text: "Đọc xong thấy tội bạn đó nhưng nghĩ 'chắc bạn ấy quen rồi' nên thôi không can thiệp.",
                points: 10,
                level: "Thụ động",
                expertAdvice: {
                    type: "chua-tu-te",
                    title: "😶 SỰ IM LẶNG ĐỒNG LÕA",
                    analysis: "Sự thờ ơ của những người xem chính là nguồn tiếp sức lớn nhất cho những kẻ miệt thị hoành hành.",
                    law: "",
                    consequence: "<b>Hậu quả:</b> Tiếp tay cho văn hóa ứng xử kém văn minh lan rộng trong học đường.",
                    kindness: "<b>💡 Lời khuyên:</b> Hãy thả một bình luận tích cực để vực dậy tinh thần cho nạn nhân bạn nhé!"
                }
            },
            {
                text: "Đăng một bài viết chửi mắng, tra khảo ngược lại những kẻ đi miệt thị bạn kia bằng từ ngữ nặng nề.",
                points: 10,
                level: "Tiêu cực",
                expertAdvice: {
                    type: "vi-pham",
                    title: "⚔️ 'ANH HÙNG BÀN PHÍM' DÙNG BẠO LỰC CHỐNG BẠO LỰC",
                    analysis: "Dùng lời lẽ thô tục để chửi mắng kẻ khác không làm bạn trở thành người tốt hơn, mà chỉ biến bạn thành một phiên bản bạo lực mạng khác.",
                    law: "<b>🚨 Cảnh báo:</b> Lăng mạ, chửi bới người khác trên mạng xã hội đều vi phạm chuẩn mực đạo đức và quy tắc ứng xử mạng.",
                    consequence: "<b>Hậu quả:</b> Tạo ra cuộc cãi vã kéo dài, làm sự việc càng thêm tồi tệ.",
                    kindness: ""
                }
            },
            {
                text: "Lên án nhẹ nhàng, thả bình luận tích cực khen ngợi ưu điểm của bạn đó và báo cáo các bình luận xúc phạm.",
                points: 10,
                level: "Văn minh",
                expertAdvice: {
                    type: "tu-te",
                    title: "💖 HIỆP SĨ ÁNH SÁNG - LAN TỎA YÊU THƯƠNG",
                    analysis: "Hành động tuyệt vời! Bạn biết cách dùng sự tử tế và công cụ báo cáo để bảo vệ người bị hại một cách văn minh nhất.",
                    law: "",
                    consequence: "",
                    kindness: "<b>🌈 GIÁ TRỊ VĂN MINH:</b> Bạn mang lại nguồn năng lượng chữa lành, giúp môi trường mạng trở nên an toàn và ấm áp hơn rất nhiều!"
                }
            }
        ]
    }
];

let currentScenario = scenarioBank[0];
let selectedOptionIndex = null; 
let isExpertOpen = false;

function getTodayKey() {
    const d = new Date();
    return d.toISOString().split('T')[0];
}

function checkHasCheckedInToday() {
    const today = getTodayKey();
    return localStorage.getItem('cyber_checked_in_' + today) === 'true';
}

function markCheckedInToday() {
    const today = getTodayKey();
    localStorage.setItem('cyber_checked_in_' + today, 'true');
}

let shuffledOptionsMap = {};
function getShuffledOptions(scenario) {
    if (!shuffledOptionsMap[scenario.id]) {
        let optionsCopy = scenario.options.map((opt, originalIndex) => ({ ...opt, originalIndex }));
        for (let i = optionsCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [optionsCopy[i], optionsCopy[j]] = [optionsCopy[j], optionsCopy[i]];
        }
        shuffledOptionsMap[scenario.id] = optionsCopy;
    }
    return shuffledOptionsMap[scenario.id];
}

function renderScenario() {
    const container = document.getElementById('scenario-container');
    if (!container) return;

    const currentOptions = getShuffledOptions(currentScenario);

    container.innerHTML = `
        <div class="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
            <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-black text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
                    <i class="fa-solid fa-fire text-amber-400 animate-pulse"></i> 🌟 MỖI NGÀY THỬ THÁCH TÌNH HUỐNG VĂN MINH ĐỂ CỘNG 10 CCS NHÉ! 🚀🔥
                </span>
            </div>
            
            <p class="text-xs font-bold text-slate-200 mb-2.5 leading-snug bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                ${currentScenario.question}
            </p>

            <div class="space-y-1.5 mb-2.5" id="scenario-options">
                ${currentOptions.map((opt, displayIdx) => {
                    let extraClass = "bg-slate-950 border-slate-800 text-slate-300 hover:bg-indigo-950/50 hover:border-indigo-500/50";
                    if (selectedOptionIndex === displayIdx) {
                        extraClass = "bg-indigo-950 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/50";
                    }
                    return `
                        <button onclick="selectOption(${displayIdx})" class="w-full text-left p-2 rounded-xl border ${extraClass} text-xs font-medium leading-relaxed transition-all duration-200 flex items-center justify-between group">
                            <span class="pr-2">${opt.text}</span>
                            <i class="fa-solid ${selectedOptionIndex === displayIdx ? 'fa-circle-check text-cyan-400 text-sm' : 'fa-chevron-right text-slate-600'}"></i>
                        </button>
                    `;
                }).join('')}
            </div>

            <div class="flex items-center gap-2 mb-1">
                ${selectedOptionIndex !== null ? `
                    <button onclick="toggleExpertAdvice()" class="flex-1 py-2 px-3 rounded-xl font-black text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                        isExpertOpen 
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 animate-pulse'
                    }">
                        <i class="fa-solid ${isExpertOpen ? 'fa-eye-slash' : 'fa-user-ninja'} text-sm"></i>
                        <span>${isExpertOpen ? 'THU GỌN GÓC CHUYÊN GIA' : '🔍 XEM GÓC CHUYÊN GIA'}</span>
                    </button>
                ` : `
                    <div class="flex-1 text-center py-2 px-3 rounded-xl bg-slate-950/60 border border-dashed border-slate-800 text-[11px] text-slate-500 font-medium italic">
                        💡 Bấm chọn 1 đáp án để xem Góc Chuyên Gia & nhận thưởng ngay!
                    </div>
                `}

                <button onclick="nextScenario()" class="py-2 px-3 rounded-xl font-bold text-xs bg-slate-800 text-cyan-300 hover:bg-cyan-950 hover:border-cyan-500 border border-slate-700 transition-all flex items-center gap-1.5 shadow" title="Đổi câu hỏi khác">
                    <i class="fa-solid fa-rotate"></i>
                    <span>Đổi câu</span>
                </button>
            </div>

            <div id="expert-container"></div>
        </div>
    `;

    updateExpertContainer();
}

function updateExpertContainer() {
    const expertDiv = document.getElementById('expert-container');
    if (!expertDiv) return;

    if (selectedOptionIndex !== null && isExpertOpen) {
        const currentOptions = getShuffledOptions(currentScenario);
        const advice = currentOptions[selectedOptionIndex].expertAdvice;

        let headerColor = "text-amber-300";
        let borderColor = "border-amber-500/60";
        let bgGradient = "from-amber-950/40 to-slate-950";

        if (advice.type === 'vi-pham') {
            headerColor = "text-rose-400";
            borderColor = "border-rose-500/80";
            bgGradient = "from-rose-950/50 via-slate-900 to-slate-950";
        } else if (advice.type === 'tu-te') {
            headerColor = "text-emerald-300";
            borderColor = "border-emerald-500/80";
            bgGradient = "from-emerald-950/50 via-slate-900 to-slate-950";
        }

        expertDiv.innerHTML = `
            <div class="mt-2.5 p-3 rounded-xl bg-gradient-to-b ${bgGradient} border ${borderColor} shadow-2xl animate-fadeIn space-y-2 text-xs relative">
                <button onclick="toggleExpertAdvice()" class="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-800 text-slate-300 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors shadow-md text-[11px] font-bold" title="Đóng bảng lời khuyên">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="font-black text-sm ${headerColor} flex items-center gap-2 border-b border-slate-800/80 pb-1.5 pr-6 uppercase tracking-wide">
                    <i class="fa-solid fa-lightbulb text-base animate-bounce"></i>
                    <span>${advice.title}</span>
                </div>
                <p class="text-slate-100 font-semibold text-sm leading-relaxed italic bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                    "${advice.analysis}"
                </p>
                ${advice.law ? `<div class="p-2 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-100 text-xs leading-relaxed font-medium">${advice.law}</div>` : ''}
                ${advice.consequence ? `<div class="text-xs text-orange-200 font-semibold leading-relaxed">${advice.consequence}</div>` : ''}
                ${advice.kindness ? `<div class="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-100 text-xs leading-relaxed font-bold">${advice.kindness}</div>` : ''}
            </div>
        `;
    } else {
        expertDiv.innerHTML = '';
    }
}

function selectOption(displayIndex) {
    selectedOptionIndex = displayIndex;

    if (!checkHasCheckedInToday()) {
        markCheckedInToday();
        if (typeof addScoreToUserClass === 'function') {
            addScoreToUserClass(10); 
        }
    }

    isExpertOpen = true; 
    renderScenario();
}

function toggleExpertAdvice() {
    isExpertOpen = !isExpertOpen;
    updateExpertContainer();
    
    const toggleBtn = document.querySelector('button[onclick="toggleExpertAdvice()"]');
    if (toggleBtn) {
        if (isExpertOpen) {
            toggleBtn.className = "flex-1 py-2 px-3 rounded-xl font-black text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-lg bg-slate-800 text-slate-300 hover:bg-slate-700";
            toggleBtn.innerHTML = '<i class="fa-solid fa-eye-slash text-sm"></i><span>THU GỌN GÓC CHUYÊN GIA</span>';
        } else {
            toggleBtn.className = "flex-1 py-2 px-3 rounded-xl font-black text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 animate-pulse";
            toggleBtn.innerHTML = '<i class="fa-solid fa-user-ninja text-sm"></i><span>🔍 XEM GÓC CHUYÊN GIA</span>';
        }
    }
}

function nextScenario() {
    const currentIndex = scenarioBank.findIndex(s => s.id === currentScenario.id);
    const nextIndex = (currentIndex + 1) % scenarioBank.length;
    currentScenario = scenarioBank[nextIndex];
    selectedOptionIndex = null; 
    isExpertOpen = false;
    renderScenario();
}

document.addEventListener('DOMContentLoaded', () => {
    renderScenario();
});