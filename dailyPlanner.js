// ==========================================
// MÔ-ĐUN: KẾ HOẠCH MỖI NGÀY (DAILY PLANNER SECTION)
// ==========================================

let dailyTasks = JSON.parse(
    localStorage.getItem('userDailyTasks') || 
    JSON.stringify([
        { id: 1, text: "Chào hỏi bạn bè & thầy cô vui vẻ", category: "kindness", done: false },
        { id: 2, text: "Đọc 5 trang sách ngày mới", category: "study", done: false },
        { id: 3, text: "Hoàn thành bài tập Toán", category: "study", done: false },
        { id: 4, text: "Tập thể dục 15 phút", category: "health", done: false }
    ])
);

let currentTaskFilter = 'all';

// Hàm render giao diện Kế Hoạch Mỗi Ngày vào container chính
window.renderDailyPlanner = function(containerId = 'daily-planner-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const total = dailyTasks.length;
    const completed = dailyTasks.filter(t => t.done).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const filteredTasks = dailyTasks.filter(t => {
        if (currentTaskFilter === 'all') return true;
        if (currentTaskFilter === 'pending') return !t.done;
        if (currentTaskFilter === 'done') return t.done;
        return t.category === currentTaskFilter;
    });

    const categoryBadges = {
        study: { label: "📚 Học tập", class: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
        health: { label: "💪 Rèn luyện", class: "bg-orange-500/10 text-orange-400 border-orange-500/30" },
        kindness: { label: "💖 Tử tế", class: "bg-pink-500/10 text-pink-400 border-pink-500/30" },
        other: { label: "✨ Khác", class: "bg-slate-500/10 text-slate-400 border-slate-500/30" }
    };

    const taskRowsHtml = filteredTasks.map(t => {
        const badge = categoryBadges[t.category] || categoryBadges.other;
        return `
            <div class="flex items-center justify-between p-3.5 bg-slate-950/80 border ${t.done ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-slate-800'} rounded-2xl transition-all duration-300 hover:border-slate-700 group">
                <div class="flex items-center gap-3 flex-1 min-w-0 pr-2">
                    <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTaskDone(${t.id}, this)" class="w-5 h-5 accent-emerald-500 rounded-lg cursor-pointer shrink-0">
                    <span class="text-xs sm:text-sm ${t.done ? 'line-through text-slate-500 font-normal' : 'text-slate-200 font-semibold'} truncate">${t.text}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full border ${badge.class} shrink-0 hidden sm:inline-block">${badge.label}</span>
                </div>
                <button onclick="deleteTask(${t.id})" class="opacity-60 group-hover:opacity-100 text-slate-500 hover:text-rose-400 text-xs px-2 py-1 transition cursor-pointer">
                    ✕
                </button>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <section class="mb-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <!-- HEADER -->
            <div class="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div class="flex items-center gap-2.5">
                    <span class="text-xs font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30 cyber-header-glow flex items-center gap-1.5">
                        📝 KẾ HOẠCH MỖI NGÀY
                    </span>
                    <span class="text-xs text-slate-400 font-medium">(${completed}/${total} Hoàn thành)</span>
                </div>

                <!-- BỘ LỌC TASK -->
                <div class="flex flex-wrap items-center gap-1.5 shrink-0">
                    <button onclick="filterPlannerTasks('all')" class="px-2.5 py-1 text-[11px] font-bold rounded-xl border transition ${currentTaskFilter === 'all' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'}">Tất cả</button>
                    <button onclick="filterPlannerTasks('pending')" class="px-2.5 py-1 text-[11px] font-bold rounded-xl border transition ${currentTaskFilter === 'pending' ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'}">Chờ làm</button>
                    <button onclick="filterPlannerTasks('done')" class="px-2.5 py-1 text-[11px] font-bold rounded-xl border transition ${currentTaskFilter === 'done' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'}">Đã xong</button>
                </div>
            </div>

            <!-- TIẾN ĐỘ THỦ CÔNG (PROGRESS BAR) -->
            <div class="my-4 space-y-1.5">
                <div class="flex justify-between text-xs font-bold">
                    <span class="text-slate-300">Mục Tiêu Ngày</span>
                    <span class="text-emerald-400 font-black">${percent}%</span>
                </div>
                <div class="w-full h-2.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5">
                    <div class="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-teal-300 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(52,211,153,0.8)]" style="width: ${percent}%;"></div>
                </div>
            </div>

            <!-- Ô NHẬP NHANH CÔNG VIỆC -->
            <div class="flex flex-col sm:flex-row gap-2 my-4">
                <input type="text" id="planner-input" placeholder="✨ Nhập mục tiêu mới cho ngày hôm nay..." class="flex-1 bg-slate-950/90 border border-slate-800 text-xs sm:text-sm text-white px-4 py-3 rounded-2xl focus:outline-none focus:border-cyan-400 transition shadow-inner">
                
                <select id="planner-category" class="bg-slate-950 border border-slate-800 text-xs text-slate-300 px-3 py-3 rounded-2xl focus:outline-none focus:border-cyan-400">
                    <option value="study">📚 Học tập</option>
                    <option value="health">💪 Rèn luyện</option>
                    <option value="kindness">💖 Tử tế</option>
                    <option value="other">✨ Khác</option>
                </select>

                <button onclick="addNewPlannerTask()" class="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition hover:scale-105 cursor-pointer shrink-0">
                    + Thêm Mục Tiêu
                </button>
            </div>

            <!-- DANH SÁCH CÔNG VIỆC -->
            <div class="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                ${taskRowsHtml || '<p class="text-xs text-slate-500 py-6 text-center italic">Không có mục tiêu nào phù hợp trong danh sách.</p>'}
            </div>
        </section>
    `;
};

window.addNewPlannerTask = function() {
    const input = document.getElementById('planner-input');
    const catSelect = document.getElementById('planner-category');
    if (!input || !input.value.trim()) return;

    dailyTasks.unshift({
        id: Date.now(),
        text: input.value.trim(),
        category: catSelect ? catSelect.value : 'other',
        done: false
    });

    localStorage.setItem('userDailyTasks', JSON.stringify(dailyTasks));
    window.renderDailyPlanner();
};

window.toggleTaskDone = function(id, checkbox) {
    const task = dailyTasks.find(t => t.id === id);
    if (!task) return;

    task.done = checkbox.checked;
    localStorage.setItem('userDailyTasks', JSON.stringify(dailyTasks));
    window.renderDailyPlanner();
};

window.deleteTask = function(id) {
    dailyTasks = dailyTasks.filter(t => t.id !== id);
    localStorage.setItem('userDailyTasks', JSON.stringify(dailyTasks));
    window.renderDailyPlanner();
};

window.filterPlannerTasks = function(filter) {
    currentTaskFilter = filter;
    window.renderDailyPlanner();
};

document.addEventListener("DOMContentLoaded", () => {
    window.renderDailyPlanner();
});