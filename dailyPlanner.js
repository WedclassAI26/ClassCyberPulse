window.renderDailyPlanner = function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let tasks = JSON.parse(localStorage.getItem('cyber_planner_tasks')) || [];
    const todayStr = new Date().toISOString().split('T')[0];

    const motivationalQuotes = [
        "✨ 'Hành trình vạn dặm khởi đầu từ một bước chân nhỏ bé. Hôm nay bạn làm rất tốt!'",
        "🚀 'Kỷ luật chính là chiếc cầu nối giữa mục tiêu và thành tựu vũ trụ của bạn.'",
        "💡 'Mỗi nhiệm vụ hoàn thành là một ngôi sao sáng thêm trên bầu trời tri thức của lớp học!'",
        "🔥 'Đừng chờ cơ hội, hãy tự tạo ra năng lượng và bứt phá giới hạn bản thân ngày hôm nay!'"
    ];
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    const dateString = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Danh sách lời khen ngợi khi hoàn thành nhiệm vụ
    const praiseMessages = [
        "🎉 PHÁO HOA NỔ TRỜI! Bạn vừa hoàn thành một mục tiêu cực kỳ xuất sắc!",
        "🌟 XUẤT SẮC! Ngôi sao tri thức của bạn lại vừa bừng sáng rực rỡ!",
        "🚀 ĐỈNH CAO! Kỷ luật thép và nỗ lực của bạn thật đáng ngưỡng mộ!",
        "🔥 THẮNG LỢI! Thêm một nhiệm vụ nữa đã được chinh phục hoàn toàn!"
    ];

    container.innerHTML = `
        <div class="space-y-4">
            <!-- BANNER CHÀO MỪNG & ĐỘNG LỰC -->
            <div class="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row justify-between items-center gap-3 relative overflow-hidden">
                <div class="absolute -right-10 -bottom-10 text-8xl opacity-10">🪐</div>
                <div class="space-y-1 relative z-10">
                    <div class="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                        <i class="fa-solid fa-clock text-emerald-400"></i> ${dateString}
                    </div>
                    <h2 class="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center gap-2">
                        <i class="fa-solid fa-rocket text-emerald-400"></i> Trạm Lịch Trình & Deadline Vũ Trụ
                    </h2>
                    <p class="text-xs text-slate-300 italic">${randomQuote}</p>
                </div>
                <div class="bg-slate-950/90 px-4 py-2 rounded-2xl border border-slate-800 text-center relative z-10 shrink-0 shadow-md">
                    <span class="text-[11px] text-slate-400 block">Tiến độ hôm nay</span>
                    <span class="text-lg font-black text-emerald-400" id="planner-progress">0/0</span>
                </div>
            </div>

            <!-- KHUNG LỜI KHEN NGỢI CHỮ VÀNG CHIẾN THẮNG RỰC RỠ -->
            <div id="planner-praise-box" class="hidden bg-slate-950/95 border-2 border-red-500 rounded-2xl p-3.5 flex items-center gap-4 text-white shadow-[0_0_35px_rgba(239,68,68,0.8)] animate-pulse transition-all duration-300 relative overflow-hidden">
                <div class="absolute inset-0 bg-[radial-gradient(circle,_rgba(239,68,68,0.2)_10%,_transparent_10%)] bg-[length:20px_20px] pointer-events-none"></div>
                <div class="text-3xl animate-bounce shrink-0 relative z-10">🎆</div>
                <div class="space-y-1 flex-1 relative z-10">
                    <div class="text-xs uppercase tracking-widest font-black text-yellow-300 flex items-center gap-2">
                        <span>✨ Chúc Mừng Thành Tích Vũ Trụ ✨</span>
                    </div>
                    <span id="planner-praise-text" class="text-base sm:text-lg font-black text-yellow-300 tracking-wide block drop-shadow-[0_0_12px_rgba(253,224,71,0.9)]"></span>
                </div>
                <div class="text-3xl animate-spin shrink-0 relative z-10">🌟</div>
            </div>

            <!-- KHUNG 2 CỘT TỐI ƯU KHÔNG GIAN -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                <!-- CỘT 1: FORM LÊN LỊCH NHIỆM VỤ & LỜI KHUYÊN NĂNG LƯỢNG -->
                <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 flex flex-col justify-between">
                    <div class="space-y-3">
                        <h3 class="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                            <i class="fa-solid fa-calendar-plus text-cyan-400"></i> Lên Lịch Nhiệm Vụ
                        </h3>
                        <div>
                            <label class="text-xs text-slate-400 block mb-1">Tên công việc / mục tiêu:</label>
                            <input type="text" id="new-task-input" placeholder="Ví dụ: Nộp bài tập Toán..." class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <label class="text-xs text-slate-400 block mb-1">Ngày bắt đầu:</label>
                                <div class="relative flex items-center">
                                    <input type="date" id="start-date-input" value="${todayStr}" onclick="this.showPicker && this.showPicker()" class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-8 py-2 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 cursor-pointer">
                                    <i class="fa-regular fa-calendar-days absolute right-3 text-cyan-400 pointer-events-none text-xs"></i>
                                </div>
                            </div>
                            <div>
                                <label class="text-xs text-slate-400 block mb-1">Hạn chót:</label>
                                <div class="relative flex items-center">
                                    <input type="date" id="end-date-input" value="${todayStr}" onclick="this.showPicker && this.showPicker()" class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-8 py-2 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 cursor-pointer">
                                    <i class="fa-regular fa-calendar-days absolute right-3 text-cyan-400 pointer-events-none text-xs"></i>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="text-xs text-slate-400 block mb-1">Mức độ ưu tiên:</label>
                            <select id="task-priority" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500">
                                <option value="normal">Bình thường 🟢</option>
                                <option value="important">Quan trọng 🟡</option>
                                <option value="very-important">Rất quan trọng 🔥</option>
                            </select>
                        </div>

                        <button id="add-task-btn" class="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs rounded-xl hover:opacity-90 transition-all shadow-md cursor-pointer">
                            Thêm Vào Kế Hoạch 🎯
                        </button>
                    </div>

                    <!-- THÊM KHUNG LỜI KHUYÊN TRUYỀN CẢM HỨNG Ý NGHĨA -->
                    <div class="mt-4 p-3 bg-gradient-to-r from-purple-950/60 via-slate-950 to-indigo-950/60 border border-purple-500/40 rounded-xl text-center space-y-1 shadow-inner">
                        <div class="text-[11px] font-black text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                            <i class="fa-solid fa-seedling"></i> Kim Chỉ Nam Thành Công
                        </div>
                        <p class="text-[11px] text-slate-300 italic leading-relaxed">
                            "Biết lập kế hoạch tỉ mỉ, kiên định hành động và luôn giữ cảm xúc tích cực, làm những việc tử tế chính là chìa khóa vàng mở cánh cửa dẫn tới thành công rực rỡ!" 🌟
                        </p>
                    </div>
                </div>

                <!-- CỘT 2: DANH SÁCH NHIỆM VỤ (CHỮ TO RÕ, ĐẸP MẮT) -->
                <div class="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
                    <h3 class="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center justify-between">
                        <span class="flex items-center gap-2"><i class="fa-solid fa-list-check text-emerald-400"></i> Danh Sách Việc Cần Làm & Deadline</span>
                    </h3>
                    <div id="task-list-items" class="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                        <!-- Render danh sách -->
                    </div>
                </div>

            </div>
        </div>
    `;

    function updateTaskList() {
        const listContainer = document.getElementById('task-list-items');
        const progressElem = document.getElementById('planner-progress');
        if (!listContainer) return;

        let completedCount = tasks.filter(t => t.completed).length;
        if (progressElem) progressElem.innerText = `${completedCount}/${tasks.length}`;

        if (tasks.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center py-14 text-slate-500 text-xs italic space-y-2">
                    <div class="text-3xl">🌱</div>
                    <div>Chưa có kế hoạch nào. Hãy chọn thời gian và thêm nhiệm vụ ở cột bên trái nhé!</div>
                </div>
            `;
            return;
        }

        const currentDateStr = new Date().toISOString().split('T')[0];

        listContainer.innerHTML = tasks.map((task, index) => {
            let badgeHTML = '';
            if (!task.completed) {
                if (task.endDate && task.endDate < currentDateStr) {
                    badgeHTML = `<span class="px-2.5 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold rounded-full animate-pulse">⚠️ Quá hạn! Cố gắng hoàn thành ngay nhé!</span>`;
                } else if (task.endDate && task.endDate === currentDateStr) {
                    badgeHTML = `<span class="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold rounded-full">⏳ Hạn chót hôm nay! Cố gắng lên bạn nhé!</span>`;
                } else {
                    badgeHTML = `<span class="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs rounded-full font-medium">Đang thực hiện</span>`;
                }
            } else {
                badgeHTML = `<span class="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold rounded-full">✨ Hoàn thành</span>`;
            }

            let priorityBadge = '';
            if (task.priority === 'important') {
                priorityBadge = '<span class="text-amber-400 ml-2 font-bold text-xs">🟡 Quan trọng</span>';
            } else if (task.priority === 'very-important') {
                priorityBadge = '<span class="text-rose-400 ml-2 font-bold text-xs animate-pulse">🔥 Rất quan trọng</span>';
            }

            return `
                <div class="flex items-center justify-between bg-slate-950/70 border ${task.completed ? 'border-emerald-500/30 opacity-70' : task.endDate < currentDateStr ? 'border-rose-500/50 bg-rose-950/10' : 'border-slate-800'} px-4 py-3 rounded-xl gap-3 transition-all">
                    <div class="flex items-center gap-3.5 flex-1">
                        <input type="checkbox" data-index="${index}" class="task-checkbox w-5 h-5 accent-emerald-500 cursor-pointer rounded" ${task.completed ? 'checked' : ''}>
                        <div class="space-y-1">
                            <div class="text-sm sm:text-base font-bold ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}">
                                ${task.text} ${priorityBadge}
                            </div>
                            <div class="text-xs text-slate-300 flex items-center gap-2.5 flex-wrap">
                                <span><i class="fa-solid fa-hourglass-half text-cyan-400"></i> ${task.startDate || todayStr} ➔ ${task.endDate || todayStr}</span>
                                ${badgeHTML}
                            </div>
                        </div>
                    </div>
                    <button data-index="${index}" class="delete-task-btn text-xs text-rose-400 hover:text-rose-300 px-3 py-2 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer">
                        <i class="fa-solid fa-trash-can text-sm"></i>
                    </button>
                </div>
            `;
        }).join('');

        localStorage.setItem('cyber_planner_tasks', JSON.stringify(tasks));
    }

    const addBtn = document.getElementById('add-task-btn');
    if (addBtn) {
        addBtn.onclick = function() {
            const text = document.getElementById('new-task-input').value.trim();
            const startDate = document.getElementById('start-date-input').value;
            const endDate = document.getElementById('end-date-input').value;
            const priority = document.getElementById('task-priority').value;

            if (!text) return;
            if (startDate > endDate) {
                alert("Ngày bắt đầu không thể lớn hơn ngày kết thúc được bạn nhé!");
                return;
            }

            tasks.push({ text, startDate, endDate, priority, completed: false });
            document.getElementById('new-task-input').value = '';
            updateTaskList();
        };
    }

    const listContainer = document.getElementById('task-list-items');
    if (listContainer) {
        listContainer.onclick = function(e) {
            const target = e.target;
            if (target.classList.contains('task-checkbox')) {
                const index = target.getAttribute('data-index');
                const isChecked = target.checked;
                tasks[index].completed = isChecked;
                
                if (isChecked) {
                    const praiseBox = document.getElementById('planner-praise-box');
                    const praiseText = document.getElementById('planner-praise-text');
                    if (praiseBox && praiseText) {
                        const randomPraise = praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
                        praiseText.innerText = randomPraise;
                        praiseBox.classList.remove('hidden');
                        
                        triggerExplosionFireworks();

                        setTimeout(() => {
                            praiseBox.classList.add('hidden');
                        }, 5000);
                    }
                }

                updateTaskList();
            }
            const deleteBtn = target.closest('.delete-task-btn');
            if (deleteBtn) {
                const index = deleteBtn.getAttribute('data-index');
                tasks.splice(index, 1);
                updateTaskList();
            }
        };
    }

    // Hàm tạo hiệu ứng pháo hoa nổ tung rực rỡ, kéo dài thời gian bay
    function triggerExplosionFireworks() {
        const colors = ['#f43f5e', '#ef4444', '#f59e0b', '#fbbf24', '#ec4899', '#8b5cf6', '#34d399', '#38bdf8'];
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.className = `fixed pointer-events-none z-50 rounded-full`;
            const size = Math.random() * 14 + 6;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 15px ${color}`;
            
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            
            particle.style.transition = `all 1.8s cubic-bezier(0.1, 0.7, 0.1, 1)`;
            document.body.appendChild(particle);

            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 550 + 150;
            const targetX = Math.cos(angle) * distance;
            const targetY = Math.sin(angle) * distance;

            setTimeout(() => {
                particle.style.transform = `translate(${targetX}px, ${targetY}px) scale(0)`;
                particle.style.opacity = '0';
            }, 40);

            setTimeout(() => {
                particle.remove();
            }, 1850);
        }
    }

    updateTaskList();
};