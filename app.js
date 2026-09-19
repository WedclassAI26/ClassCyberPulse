// ==========================================
// 1. QUẢN LÝ HIỂN THỊ GÓC PHẢI
// HỖ TRỢ KHÁCH & THÀNH VIÊN
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    updateAuthDisplay();
    renderLeaderboard();

    // TỰ ĐỘNG KHỞI TẠO TẤT CẢ CÁC MODULE KHI TRANG VỪA LOAD
    setTimeout(() => {
        if (typeof renderMoodStation === 'function') {
            renderMoodStation();
        }
        if (typeof renderDailyPlanner === 'function') {
            renderDailyPlanner();
        }
    }, 100);
});

function updateAuthDisplay() {
    const authContainer = document.getElementById("auth-container");
    if (!authContainer) return;

    const savedUser = localStorage.getItem("cyberUser");
    let user = null;
    if (savedUser) { try { user = JSON.parse(savedUser); } catch (e) { user = null; } }

    const currentScore = typeof window.getGlobalScore === 'function' ? window.getGlobalScore() : 0;

    // Nếu đã đăng nhập thành công bằng tài khoản
    if (user && user.loggedIn === true) {
        const displayName = user.name || user.email || "Thành viên";
        const displayClass = user.classRoom || "Học sinh";
        authContainer.innerHTML = `
            <div class="flex items-center gap-3 bg-slate-800/90 border border-emerald-500/40 px-3.5 py-2 rounded-2xl shadow-lg">
                <div>
                    <div class="text-xs font-bold text-white">${escapeHTML(displayName)}</div>
                    <div class="text-[10px] text-slate-400">Lớp: <span class="text-cyan-400 font-semibold">${escapeHTML(displayClass)}</span></div>
                </div>
                <span class="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-xl font-bold" id="user-score">${currentScore} CCS</span>
                <button onclick="handleLogout()" class="text-slate-400 hover:text-red-400 text-xs cursor-pointer ml-1" title="Đăng xuất">
                    <i class="fa-solid fa-right-from-bracket"></i>
                </button>
            </div>
        `;
        return;
    }

    // Nếu là Khách Google (Không tham gia xếp hạng)
    authContainer.innerHTML = `
        <div class="flex items-center gap-3 bg-slate-800/90 border border-slate-700/60 px-3.5 py-2 rounded-2xl shadow-lg">
            <div>
                <div class="text-xs font-bold text-slate-200">Khách Google</div>
                <div class="text-[10px] text-slate-400">Chưa cập nhật</div>
            </div>
            <span class="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-xl font-bold" id="user-score">${currentScore} CCS</span>
            <a href="login.html" class="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ml-1">
                <i class="fa-solid fa-user-astronaut"></i> Đăng Nhập
            </a>
        </div>
    `;
}

function handleLogout() {
    localStorage.removeItem("cyberUser");
    sessionStorage.removeItem("guestScore");
    updateAuthDisplay();
    refreshScoreDisplay(0);
}

function showLoginReminder() {
    let notice = document.getElementById("login-reminder");
    if (!notice) {
        notice = document.createElement("div");
        notice.id = "login-reminder";
        notice.className = "fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/95 border border-amber-400/40 text-slate-200 px-4 py-3 rounded-xl shadow-2xl text-xs backdrop-blur-md transition-all duration-300";
        document.body.appendChild(notice);
    }
    notice.innerHTML = `
        <div class="flex items-center gap-2">
            <span class="text-amber-400">⚠️</span>
            <span>Bạn cần đăng nhập để lưu điểm cho lần sau nhé.</span>
        </div>
    `;
    notice.classList.remove("hidden");
    clearTimeout(window.loginReminderTimer);
    window.loginReminderTimer = setTimeout(() => {
        notice.classList.add("hidden");
    }, 3500);
}

function refreshScoreDisplay(score) {
    score = Number(score) || 0;
    const ids = ["user-score", "score", "current-score", "ccs-score", "profile-score"];
    ids.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = score + " CCS";
    });
    document.querySelectorAll("[data-user-score]").forEach(element => {
        element.textContent = score + " CCS";
    });
}

function escapeHTML(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==========================================
// 2. DỮ LIỆU & BẢNG XẾP HẠNG LỚP HỌC
// ==========================================
let classesData = [
    {
        id: '11a1',
        name: 'Lớp 11A1',
        title: 'Hành Tinh Xanh Cấp 5',
        score: parseInt(localStorage.getItem('cyber_score_11a1')) || 1460,
        maxScore: 2000,
        icon: '🪐',
        rankText: '🥇 HẠNG 1',
        rankClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        slogan: 'Lớp 11A1 - Đoàn kết, sáng tạo, luôn dẫn đầu!',
        streak: 15,
        members: 42
    },
    {
        id: '12c3',
        name: 'Lớp 12C3',
        title: 'Hành Tinh Băng Cấp 4',
        score: 1380,
        maxScore: 2000,
        icon: '🌐',
        rankText: '🥈 HẠNG 2',
        rankClass: 'bg-amber-600/20 text-amber-200 border-amber-600/40',
        slogan: 'Kỷ luật là sức mạnh - Tự tin bứt phá!',
        streak: 12,
        members: 40
    },
    {
        id: '10a2',
        name: 'Lớp 10A2',
        title: 'Hành Tinh Mầm Cấp 3',
        score: 1250,
        maxScore: 2000,
        icon: '🌱',
        rankText: '🥉 HẠNG 3',
        rankClass: 'bg-orange-600/20 text-orange-300 border-orange-600/40',
        slogan: 'Học hết sức, chơi hết mình!',
        streak: 9,
        members: 38
    }
];

function renderLeaderboard() {
    const container = document.getElementById('leaderboard-list');
    if (!container) return;

    classesData.sort((a, b) => b.score - a.score);

    classesData.forEach((cls, idx) => {
        if (idx === 0) {
            cls.rankText = '🥇 HẠNG 1';
            cls.rankClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
        } else if (idx === 1) {
            cls.rankText = '🥈 HẠNG 2';
            cls.rankClass = 'bg-amber-600/20 text-amber-200 border-amber-600/40';
        } else {
            cls.rankText = '🥉 HẠNG 3';
            cls.rankClass = 'bg-orange-600/20 text-orange-300 border-orange-600/40';
        }
    });

    container.innerHTML = classesData.map(cls => {
        const percent = Math.min(Math.round((cls.score / cls.maxScore) * 100), 100);
        return `
            <div onclick="showClassDetails('${cls.id}')" class="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between hover:border-cyan-500/50 hover:scale-[1.02] cursor-pointer transition-all duration-300 min-h-[240px] group">
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <span class="px-3.5 py-1 rounded-full text-xs font-black border ${cls.rankClass} uppercase tracking-wider">
                            ${cls.rankText}
                        </span>
                        <div class="relative flex items-center justify-center">
                            <div class="absolute w-12 h-12 bg-cyan-500/20 rounded-full blur-xl animate-pulse group-hover:bg-cyan-400/40 transition-all"></div>
                            <div class="text-6xl relative z-10 animate-bounce [animation-duration:3s] filter drop-shadow-[0_0_18px_rgba(34,211,238,0.7)] group-hover:scale-125 transition-transform duration-300">
                                ${cls.icon}
                            </div>
                        </div>
                    </div>
                    <h3 class="text-2xl font-black text-white tracking-wide">${cls.name}</h3>
                    <p class="text-xs text-indigo-400 font-medium mt-1 mb-6">${cls.title}</p>
                </div>
                <div>
                    <div class="flex justify-between items-center text-xs font-semibold mb-2">
                        <span class="text-slate-400">Điểm Năng Lượng CCS:</span>
                        <span class="text-emerald-400 font-bold text-sm tracking-wide">${cls.score.toLocaleString()} CCS</span>
                    </div>
                    <div class="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div class="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(45,212,191,0.5)]" style="width: ${percent}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================
// 3. CÁC HÀM TIỆN ÍCH (MODAL, MOOD, MUSIC)
// ==========================================

function selectMood(mood) {
    const quotes = {
        happy: "🔥 Năng lượng cực cao! Kích hoạt chế độ bứt phá ngày mới!",
        chill: "🌿 Tâm trạng bình yên, rất phù hợp để tập trung sáng tạo!",
        stressed: "☕ Hít một hơi thật sâu... Mọi thứ rồi sẽ ổn thôi, cố lên nhé!",
        tired: "😴 Bạn đã vất vả rồi. Thả lỏng cơ thể và nghe một bản nhạc nhẹ nhé!"
    };
    const moodElem = document.getElementById('mood-quote');
    if (moodElem) moodElem.innerText = quotes[mood] || "";

    const audio = document.getElementById('bg-audio');
    if (audio) audio.play();
}

function toggleMusic() {
    const audio = document.getElementById('bg-audio');
    const playBtn = document.getElementById('play-btn');
    if (!audio) return;

    if (audio.paused) {
        audio.play();
        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        audio.pause();
        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
}

function showClassDetails(classId) {
    const cls = classesData.find(c => c.id === classId);
    if (!cls) return;

    const modal = document.getElementById('class-detail-modal');
    const content = document.getElementById('modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="text-center mb-6">
            <div class="text-6xl mb-3 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-bounce [animation-duration:2s]">${cls.icon}</div>
            <span class="px-3.5 py-1 rounded-full text-xs font-black border ${cls.rankClass} uppercase tracking-wider inline-block mb-2">
                ${cls.rankText}
            </span>
            <h3 class="text-2xl font-black text-white tracking-wide">${cls.name}</h3>
            <p class="text-xs text-indigo-400 font-semibold mt-0.5">${cls.title}</p>
            <p class="text-xs text-slate-400 italic mt-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">${cls.slogan || 'Sẵn sàng bứt phá!'}</p>
        </div>
        <div class="grid grid-cols-3 gap-3 mb-6 text-center">
            <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div class="text-[10px] text-slate-400 uppercase font-semibold">Tổng Điểm</div>
                <div class="text-base font-black text-emerald-400 mt-1">${cls.score.toLocaleString()} CCS</div>
            </div>
            <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div class="text-[10px] text-slate-400 uppercase font-semibold">Chuỗi Check-in</div>
                <div class="text-base font-black text-amber-400 mt-1">🔥 ${cls.streak || 10} Ngày</div>
            </div>
            <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div class="text-[10px] text-slate-400 uppercase font-semibold">Thành Viên</div>
                <div class="text-base font-black text-cyan-400 mt-1">👥 ${cls.members || 40} Học sinh</div>
            </div>
        </div>
        <button onclick="closeClassModal()" class="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 cursor-pointer">
            Đóng Cửa Sổ
        </button>
    `;
    modal.classList.remove('hidden');
}

function closeClassModal() {
    const modal = document.getElementById('class-detail-modal');
    if (modal) modal.classList.add('hidden');
}

// ==========================================
// 4. HÀM CHUYỂN TAB TRÊN HEADER NAVIGATION
// ==========================================
window.switchTab = function(tabId) {
    const tabs = ['dashboard', 'planner', 'quests', 'wall', 'ethics'];
    
    tabs.forEach(t => {
        const sec = document.getElementById(`tab-${t}`);
        const nav = document.getElementById(`nav-${t}`);
        if (sec) sec.classList.add('hidden');
        if (nav) nav.className = "px-4 py-2 rounded-xl text-sm font-bold transition-all text-slate-400 hover:text-white cursor-pointer";
    });

    const activeSec = document.getElementById(`tab-${tabId}`);
    const activeNav = document.getElementById(`nav-${tabId}`);
    if (activeSec) activeSec.classList.remove('hidden');
    if (activeNav) activeNav.className = "px-4 py-2 rounded-xl text-sm font-bold transition-all text-white bg-indigo-600 shadow-md cursor-pointer";

    if (tabId === 'quests') {
        const container = document.getElementById('scenario-container') || document.getElementById('tab-quests');
        if (container) {
            if (typeof window.renderQuestsModule === 'function') window.renderQuestsModule(container.id);
            else if (typeof window.renderScenarioModule === 'function') window.renderScenarioModule(container.id);
            else if (typeof renderQuestsModule === 'function') renderQuestsModule(container.id);
        }
    }
    else if (tabId === 'wall') {
        const container = document.getElementById('kindness-module-container') || document.getElementById('tab-wall');
        if (container) {
            if (typeof window.renderKindnessModule === 'function') window.renderKindnessModule(container.id);
            else if (typeof renderKindnessModule === 'function') renderKindnessModule(container.id);
        }
    }
    else if (tabId === 'ethics') {
        const container = document.getElementById('ethics-module-container') || document.getElementById('tab-ethics');
        if (container) {
            if (typeof window.renderEthicsLogModule === 'function') window.renderEthicsLogModule(container.id);
            else if (typeof renderEthicsLogModule === 'function') renderEthicsLogModule(container.id);
        }
    }
    else if (tabId === 'planner') {
        const container = document.getElementById('planner-content') || document.getElementById('tab-planner');
        if (container) {
            if (typeof window.renderDailyPlanner === 'function') window.renderDailyPlanner(container.id);
            else if (typeof window.renderPlannerModule === 'function') window.renderPlannerModule(container.id);
            else if (typeof renderDailyPlanner === 'function') renderDailyPlanner(container.id);
        }
    }

    if (tabId === 'dashboard' && typeof window.initPersonalLeaderboardListener === 'function') {
        window.initPersonalLeaderboardListener();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (typeof window.switchTab === 'function') {
            window.switchTab('dashboard');
        }
    }, 200);
});

// ==========================================
// 5. ĐỒNG BỘ VÀ CỘNG ĐIỂM CHUẨN HOÁ TOÀN CỤC
// (CHỈ THÀNH VIÊN ĐÃ ĐĂNG NHẬP MỚI ĐƯỢC TÍNH ĐIỂM XẾP HẠNG)
// ==========================================
window.getGlobalScore = function() {
    const guest = Number(sessionStorage.getItem("guestScore") || 0);
    const savedUser = localStorage.getItem("cyberUser");
    let userScore = 0;
    if (savedUser) {
        try {
            const u = JSON.parse(savedUser);
            if (u && u.loggedIn) userScore = Number(u.score || 0);
        } catch(e) {}
    }
    return savedUser ? userScore : guest;
};

window.addScore = function(pointsToAdd) {
    const points = Number(pointsToAdd) || 0;
    if (points <= 0) return;

    const savedUser = localStorage.getItem("cyberUser");
    let user = null;
    if (savedUser) { try { user = JSON.parse(savedUser); } catch (e) {} }

    // 1. Cập nhật điểm Local tùy theo trạng thái
    if (user && user.loggedIn) {
        user.score = (Number(user.score) || 0) + points;
        localStorage.setItem("cyberUser", JSON.stringify(user));
    } else {
        let guestScore = Number(sessionStorage.getItem("guestScore") || 0);
        guestScore += points;
        sessionStorage.setItem("guestScore", String(guestScore));
    }

    const currentScore = window.getGlobalScore();
    updateAuthDisplay();
    refreshScoreDisplay(currentScore);

    // 2. CHỈ ĐỒNG BỘ LÊN FIREBASE (XẾP HẠNG) NẾU LÀ THÀNH VIÊN ĐÃ ĐĂNG NHẬP
    if (user && user.loggedIn && window.db) {
        const userId = user.email ? user.email.replace(/[^a-zA-Z0-9]/g, "_") : "user_member";
        const userName = user.name || user.email || "Thành viên";
        const userClass = user.classRoom || "Học sinh";

        window.db.collection("users").doc(userId).set({
            name: userName,
            className: userClass,
            ccs: currentScore,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).then(() => {
            if (typeof window.initPersonalLeaderboardListener === 'function') {
                window.initPersonalLeaderboardListener();
            }
        }).catch(err => console.log("Lỗi đồng bộ users:", err));
    }
};

document.addEventListener("DOMContentLoaded", () => {
    if (typeof updateAuthDisplay === 'function') {
        updateAuthDisplay();
    }
});