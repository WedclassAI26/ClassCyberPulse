// ==========================================
// GIAO DIỆN & LOGIC XỬ LÝ THỬ THÁCH VĂN MINH MẠNG (DYNAMIC RANDOM CLEANED)
// ==========================================
let currentScenario = null;
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

// KHỞI TẠO CÂU HỎI NGẪU NHIÊN NGAY KHI TẢI TRANG
function initScenario() {
    if (typeof scenarioBank !== 'undefined' && scenarioBank.length > 0) {
        const randomIndex = Math.floor(Math.random() * scenarioBank.length);
        currentScenario = scenarioBank[randomIndex];
    } else {
        currentScenario = null;
    }
    renderScenario();
}

function renderScenario() {
    const container = document.getElementById('scenario-container');
    if (!container) return;

    if (!currentScenario && typeof scenarioBank !== 'undefined' && scenarioBank.length > 0) {
        const randomIndex = Math.floor(Math.random() * scenarioBank.length);
        currentScenario = scenarioBank[randomIndex];
    }
    
    if (!currentScenario || typeof scenarioBank === 'undefined') {
        container.innerHTML = `<div class="p-4 text-center text-rose-400">Không tìm thấy ngân hàng câu hỏi! Kiểm tra lại file questionBank.js</div>`;
        return;
    }

    const currentOptions = getShuffledOptions(currentScenario);
    const totalCount = scenarioBank.length;

    container.innerHTML = `
        <div class="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
            <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-black text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
                    🔥 MỖI NGÀY THỬ THÁCH TÌNH HUỐNG VĂN MINH ĐỂ CỘNG 10CCS NHÉ!🚀🔥
                </span>
            </div>
            
            <p class="text-xs font-bold text-slate-200 mb-2.5 leading-snug bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                ${currentScenario.title}: ${currentScenario.question}
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

                <button onclick="nextScenario()" class="py-2 px-3 rounded-xl font-bold text-xs bg-slate-800 text-cyan-300 hover:bg-cyan-950 hover:border-cyan-500 border border-slate-700 transition-all flex items-center gap-1.5 shadow" title="Đổi câu hỏi ngẫu nhiên khác">
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
}

// HÀM ĐỔI CÂU NGẪU NHIÊN: LỰA CHỌN TRONG GẦN 30 CÂU VÀ TRÁNH TRÙNG LẶP CÂU HIỆN TẠI
function nextScenario() {
    if (typeof scenarioBank === 'undefined' || scenarioBank.length === 0) return;
    
    if (scenarioBank.length === 1) {
        currentScenario = scenarioBank[0];
    } else {
        let nextRandIndex;
        do {
            nextRandIndex = Math.floor(Math.random() * scenarioBank.length);
        } while (scenarioBank[nextRandIndex].id === currentScenario.id);

        currentScenario = scenarioBank[nextRandIndex];
    }

    selectedOptionIndex = null; 
    isExpertOpen = false;
    renderScenario();
}

// Đảm bảo khi DOM sẵn sàng là gọi ngay hàm khởi tạo ngẫu nhiên
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScenario);
} else {
    initScenario();
}