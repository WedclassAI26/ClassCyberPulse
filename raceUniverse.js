// ==========================================
// MÔ-ĐUN BẢNG XẾP HẠNG THI ĐUA CÁ NHÂN (RACE UNIVERSE)
// ==========================================

window.renderPersonalLeaderboard = function(users) {
    const container = document.getElementById('race-universe-container');
    if (!container || !users) return;

    // 1. CHỈ LỌC LẤY NHỮNG THÀNH VIÊN CHÍNH THỨC (LOẠI BỎ HOÀN TOÀN KHÁCH)
    const validUsers = users.filter(user => {
        return user.name && !user.name.includes("Khách Google") && !user.id.startsWith("guest_");
    });

    // 2. SẮP XẾP TOÀN BỘ HỌC SINH THEO ĐIỂM GIẢM DẦN (CAO NHẤT XẾP TRƯỚC)
    validUsers.sort((a, b) => (Number(b.ccs) || 0) - (Number(a.ccs) || 0));

    // 3. CỐ ĐỊNH TOP 3 CAO ĐIỂM NHẤT HỆ THỐNG CHO TẤT CẢ MỌI NGƯỜI CÙNG XEM
    const top3 = validUsers.slice(0, 3);
    const restUsers = validUsers.slice(3);

    const savedUser = localStorage.getItem("cyberUser");
    let currentUser = null;
    if (savedUser) { try { currentUser = JSON.parse(savedUser); } catch(e) {} }
    
    const isLogged = currentUser && currentUser.loggedIn === true;
    const currentName = isLogged ? (currentUser.name || currentUser.email) : "Khách Google";
    const currentId = isLogged && currentUser.email ? currentUser.email.replace(/[^a-zA-Z0-9]/g, "_") : "";

    const rankStyles = [
        { 
            text: 'QUÁN QUÂN HÀNH TINH SỐ', 
            border: 'border-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.7)]', 
            bg: 'bg-gradient-to-b from-amber-500/30 via-slate-900/95 to-slate-950', 
            badgeBg: 'bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 text-slate-950 font-black',
            title: 'Thủ Lĩnh Tử Tế',
            glow: 'bg-amber-500/50',
            planetSymbol: '<i class="fa-solid fa-crown text-yellow-400 animate-bounce filter drop-shadow-[0_0_20px_rgba(250,204,21,1)]"></i>',
            ringColor: 'border-yellow-400'
        },
        { 
            text: 'Á QUÂN VŨ TRỤ', 
            border: 'border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.6)]', 
            bg: 'bg-gradient-to-b from-cyan-600/30 via-slate-900/95 to-slate-950', 
            badgeBg: 'bg-gradient-to-r from-cyan-300 via-teal-400 to-blue-500 text-slate-950 font-black',
            title: 'Sứ Giả An Toàn Mạng',
            glow: 'bg-cyan-500/40',
            planetSymbol: '<i class="fa-solid fa-fire-flame-curved text-cyan-400 animate-pulse filter drop-shadow-[0_0_20px_rgba(34,211,238,1)]"></i>',
            ringColor: 'border-cyan-300'
        },
        { 
            text: 'QUÝ QUÂN TINH TÚ', 
            border: 'border-purple-400 shadow-[0_0_40px_rgba(192,132,252,0.6)]', 
            bg: 'bg-gradient-to-b from-purple-600/30 via-slate-900/95 to-slate-950', 
            badgeBg: 'bg-gradient-to-r from-purple-300 via-fuchsia-400 to-pink-500 text-slate-950 font-black',
            title: 'Ngôi Sao Đạo Đức Số',
            glow: 'bg-purple-500/40',
            planetSymbol: '<i class="fa-solid fa-trophy text-purple-400 animate-bounce [animation-duration:2s] filter drop-shadow-[0_0_20px_rgba(192,132,252,1)]"></i>',
            ringColor: 'border-purple-300'
        }
    ];

    let top3HTML = rankStyles.map((r, idx) => {
        const user = top3[idx];
        
        if (!user) {
            return `
                <div class="relative group pt-2 opacity-60">
                    <div class="relative bg-slate-900/60 border-2 border-slate-700/60 bg-slate-900 p-5 rounded-2xl shadow-inner flex flex-col items-center justify-between text-center overflow-hidden h-full">
                        <div class="w-full flex flex-col items-center gap-1.5 mb-2">
                            <div class="text-3xl text-slate-600 my-1"><i class="fa-solid fa-lock"></i></div>
                            <span class="px-4 py-1 rounded-full text-[11px] bg-slate-800 text-slate-400 uppercase tracking-wider border border-slate-700">
                                ${r.text}
                            </span>
                        </div>
                        <div class="relative my-3">
                            <div class="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-600 border border-slate-700">
                                ?
                            </div>
                        </div>
                        <h4 class="text-base font-bold text-slate-500 tracking-wide truncate w-full mt-2 mb-0.5">Đang chờ chinh phục</h4>
                        <p class="text-[11px] text-slate-600 font-medium mb-3 px-3 py-1 rounded-full bg-slate-950/40">Chưa có dữ liệu</p>
                        <div class="w-full bg-slate-950/50 py-2.5 px-3 rounded-xl border border-slate-800">
                            <span class="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-0.5">${r.title}</span>
                            <span class="text-base font-bold text-slate-600">0 CCS</span>
                        </div>
                    </div>
                </div>
            `;
        }

        const initial = (user.name || 'U').charAt(0).toUpperCase();

        return `
            <div class="relative group pt-2">
                <div class="absolute inset-0 ${r.glow} rounded-2xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
                
                <div class="relative bg-slate-900/95 border-2 ${r.border} ${r.bg} p-5 rounded-2xl shadow-xl flex flex-col items-center justify-between text-center overflow-hidden transform hover:-translate-y-2 transition-all duration-300">
                    <div class="w-full flex flex-col items-center gap-1.5 mb-2">
                        <div class="text-4xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] my-1">
                            ${r.planetSymbol}
                        </div>
                        <span class="px-4 py-1 rounded-full text-[11px] ${r.badgeBg} uppercase tracking-wider shadow-md border border-white/40">
                            ⚡ ${r.text} ⚡
                        </span>
                    </div>
                    
                    <div class="relative my-1">
                        <div class="absolute -inset-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-xl blur-lg opacity-70 animate-pulse"></div>
                        <div class="relative w-16 h-16 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center text-2xl font-black text-white shadow-xl border-2 ${r.ringColor} transform group-hover:scale-105 transition-transform duration-300">
                            ${initial}
                        </div>
                    </div>

                    <h4 class="text-xl font-black text-white tracking-wide truncate w-full mt-2 mb-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">${escapeHTML(user.name)}</h4>
                    <p class="text-[11px] text-sky-200 font-bold mb-3 px-3 py-1 rounded-full bg-slate-950/80 border border-sky-400/30">${escapeHTML(user.className || 'Học sinh')}</p>
                    
                    <div class="w-full bg-slate-950/90 py-2.5 px-3 rounded-xl border border-slate-800 shadow-inner group-hover:border-cyan-500/50 transition-colors">
                        <span class="text-[10px] font-extrabold text-cyan-300 uppercase tracking-wider block mb-0.5">${r.title}</span>
                        <span class="text-xl font-black text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.9)]">${user.ccs || 0} CCS</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    let restHTML = restUsers.map((user, idx) => {
        const rankNumber = idx + 4;
        const isMe = isLogged && (user.id === currentId || user.name === currentName);
        const initial = (user.name || 'U').charAt(0).toUpperCase();

        return `
            <div class="flex items-center justify-between p-3.5 sm:p-4 ${isMe ? 'bg-indigo-950/80 border-indigo-500/80 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-slate-900/80 border-slate-800/80'} rounded-2xl border hover:border-cyan-400/60 hover:bg-slate-900 transition-all duration-300 group">
                <div class="flex items-center gap-3 sm:gap-4 min-w-0">
                    <!-- Huy hiệu số thứ hạng -->
                    <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-950 border border-slate-700 text-cyan-400 font-black text-xs flex items-center justify-center shadow-inner group-hover:border-cyan-400 transition-colors shrink-0">
                        #${rankNumber}
                    </div>
                    
                    <!-- Avatar nhỏ và thông tin học sinh -->
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-md border border-white/20 shrink-0">
                            ${initial}
                        </div>
                        <div class="min-w-0">
                            <div class="text-xs font-black ${isMe ? 'text-indigo-300' : 'text-white'} flex flex-wrap items-center gap-2">
                                <span class="truncate">${escapeHTML(user.name)}</span>
                                ${isMe ? '<span class="px-2 py-0.5 rounded-full text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase font-bold shrink-0">Bạn</span>' : ''}
                            </div>
                            <div class="text-[10px] text-cyan-300/80 font-semibold mt-0.5 truncate">${escapeHTML(user.className || 'Học sinh')}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Điểm số CCS -->
                <div class="text-right shrink-0 ml-2">
                    <span class="text-xs sm:text-sm font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]">${user.ccs || 0} CCS</span>
                </div>
            </div>
        `;
    }).join('');

    const myRankIdx = validUsers.findIndex(u => isLogged && (u.id === currentId || u.name === currentName));
    const myRankNum = myRankIdx !== -1 ? myRankIdx + 1 : '-';
    const activeScore = typeof window.getGlobalScore === 'function' ? window.getGlobalScore() : 0;
    const myScore = isLogged && myRankIdx !== -1 ? validUsers[myRankIdx].ccs : (isLogged ? activeScore : 0);

    container.innerHTML = `
        <div class="space-y-6 px-1 sm:px-2">
            <!-- Tiêu đề & Tổng số học sinh -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2">
                <div>
                    <h2 class="text-xl sm:text-2xl font-black text-white flex flex-wrap items-center gap-2">
                        <span class="text-amber-400">🌟 Bảng Xếp Hạng Công Dân Số</span>
                        <span class="text-[10px] sm:text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">TỔNG ${validUsers.length} HỌC SINH</span>
                    </h2>
                    <p class="text-[11px] sm:text-xs text-slate-400 mt-1">Hệ thống tự động vinh danh Top 3 thành viên cao điểm nhất toàn trường thời gian thực.</p>
                </div>
            </div>

            <!-- Top 3: Tự động xếp dọc 1 cột trên điện thoại, ngang 3 cột trên máy tính -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${top3HTML}
            </div>

            <!-- Danh sách từ hạng 4 trở xuống -->
            ${restUsers.length > 0 ? `
                <div class="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
                    <h4 class="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-wider mb-3">DANH SÁCH THI ĐUA CÁ NHÂN (${restUsers.length} Học Sinh)</h4>
                    <div class="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                        ${restHTML}
                    </div>
                </div>
            ` : ''}

            <!-- Thanh tổng kết cá nhân ở đáy (tối ưu chống tràn chữ trên điện thoại) -->
            <div class="bg-amber-500/10 border border-amber-500/30 p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-2">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/40 shrink-0">
                        #${myRankNum}
                    </div>
                    <div class="min-w-0">
                        <div class="text-xs font-bold text-white truncate">Thứ hạng của bạn (${escapeHTML(currentName)})</div>
                        <div class="text-[10px] text-amber-300">${isLogged ? 'Thành viên chính thức' : 'Khách không tham gia xếp hạng'}</div>
                    </div>
                </div>
                <div class="text-sm font-black text-amber-400 shrink-0">${isLogged ? myScore : 0} CCS</div>
            </div>
        </div>
    `;
};

window.initPersonalLeaderboardListener = function() {
    const savedUser = localStorage.getItem("cyberUser");
    let currentUser = null;
    if (savedUser) { try { currentUser = JSON.parse(savedUser); } catch(e) {} }

    const isLogged = currentUser && currentUser.loggedIn === true;
    const activeScore = typeof window.getGlobalScore === 'function' ? window.getGlobalScore() : 0;

    if (window.db) {
        if (isLogged) {
            const userId = (currentUser.email || 'user').replace(/[^a-zA-Z0-9]/g, "_");
            window.db.collection("users").doc(userId).set({
                name: currentUser.name || currentUser.email || 'Thành viên',
                className: currentUser.classRoom || 'Học sinh',
                ccs: activeScore,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true }).catch(() => {});
        }

        // LẮNG NGHE TOÀN BỘ DỮ LIỆU CHUNG TRÊN FIREBASE ĐỂ TẤT CẢ CÁC TRÌNH DUYỆT ĐỀU THẤY GIỐNG HỆT NHAU
        window.db.collection("users")
            .orderBy("ccs", "desc")
            .onSnapshot((snapshot) => {
                let realUsers = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const name = data.name || "Học sinh";
                    if (!name.includes("Khách Google") && !doc.id.startsWith("guest_")) {
                        realUsers.push({
                            id: doc.id,
                            name: name,
                            className: data.className || "Chưa cập nhật",
                            ccs: Number(data.ccs) || 0
                        });
                    }
                });

                window.renderPersonalLeaderboard(realUsers);
            }, (err) => {
                window.renderPersonalLeaderboard([]);
            });
    } else {
        window.renderPersonalLeaderboard([]);
    }
};

function escapeHTML(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (typeof window.initPersonalLeaderboardListener === 'function') {
            window.initPersonalLeaderboardListener();
        }
    }, 200);
});