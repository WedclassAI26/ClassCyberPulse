// ==========================================
// MÔ-ĐUN BẢNG XẾP HẠNG THI ĐUA CÁ NHÂN (RACE UNIVERSE)
// ==========================================

window.renderPersonalLeaderboard = function(users) {
    const container = document.getElementById('race-universe-container');
    if (!container || !users) return;

    // CHỈ LỌC LẤY NHỮNG THÀNH VIÊN CHÍNH THỨC (LOẠI BỎ HOÀN TOÀN KHÁCH)
    const validUsers = users.filter(user => {
        return user.name && !user.name.includes("Khách Google") && !user.id.startsWith("guest_");
    });

    validUsers.sort((a, b) => (Number(b.ccs) || 0) - (Number(a.ccs) || 0));

    const top3 = validUsers.slice(0, 3);
    const restUsers = validUsers.slice(3);

    const savedUser = localStorage.getItem("cyberUser");
    let currentUser = null;
    if (savedUser) { try { currentUser = JSON.parse(savedUser); } catch(e) {} }
    
    const isLogged = currentUser && currentUser.loggedIn === true;
    const currentName = isLogged ? (currentUser.name || currentUser.email) : "Khách Google";
    const currentId = isLogged && currentUser.email ? currentUser.email.replace(/[^a-zA-Z0-9]/g, "_") : "";

 let top3HTML = top3.map((user, idx) => {
        const ranks = [
            { 
                text: 'QUÁN QUÂN HÀNH TINH SỐ', 
                border: 'border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.8)]', 
                bg: 'bg-gradient-to-b from-cyan-600/30 via-slate-900/95 to-slate-950', 
                badgeBg: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-300 text-slate-950 font-black',
                title: 'Thủ Lĩnh Tử Tế',
                glow: 'bg-cyan-500/50',
                planetSymbol: '<i class="fa-solid fa-globe text-cyan-400 animate-spin [animation-duration:12s] filter drop-shadow-[0_0_20px_rgba(34,211,238,0.9)]"></i>',
                ringColor: 'border-cyan-300'
            },
            { 
                text: 'Á QUÂN VŨ TRỤ', 
                border: 'border-blue-400 shadow-[0_0_45px_rgba(59,130,246,0.7)]', 
                bg: 'bg-gradient-to-b from-blue-600/25 via-slate-900/95 to-slate-950', 
                badgeBg: 'bg-gradient-to-r from-blue-400 via-indigo-500 to-cyan-300 text-slate-950 font-black',
                title: 'Sứ Giả An Toàn Mạng',
                glow: 'bg-blue-500/40',
                planetSymbol: '<i class="fa-solid fa-satellite text-blue-400 animate-bounce [animation-duration:3s] filter drop-shadow-[0_0_20px_rgba(59,130,246,0.9)]"></i>',
                ringColor: 'border-blue-300'
            },
            { 
                text: 'QUÝ QUÂN TINH TÚ', 
                border: 'border-teal-400 shadow-[0_0_45px_rgba(45,212,191,0.7)]', 
                bg: 'bg-gradient-to-b from-teal-600/25 via-slate-900/95 to-slate-950', 
                badgeBg: 'bg-gradient-to-r from-teal-400 via-emerald-500 to-cyan-300 text-slate-950 font-black',
                title: 'Ngôi Sao Đạo Đức Số',
                glow: 'bg-teal-500/40',
                planetSymbol: '<i class="fa-solid fa-meteor text-teal-400 animate-pulse filter drop-shadow-[0_0_20px_rgba(45,212,191,0.9)]"></i>',
                ringColor: 'border-teal-300'
            }
        ];
        const r = ranks[idx] || ranks[2];
        const initial = (user.name || 'U').charAt(0).toUpperCase();

        return `
            <div class="relative group pt-4">
                <!-- Hào quang phát sáng nền cực mạnh -->
                <div class="absolute inset-0 ${r.glow} rounded-3xl blur-3xl opacity-95 group-hover:opacity-100 transition duration-500"></div>
                
                <div class="relative bg-slate-900/95 border-2 ${r.border} ${r.bg} p-6 rounded-3xl shadow-2xl flex flex-col items-center justify-between text-center overflow-hidden transform hover:-translate-y-2.5 transition-all duration-300">
                    
                    <!-- Biểu tượng hành tinh lớn và huy hiệu rực rỡ ở trên -->
                    <div class="w-full flex flex-col items-center gap-2 mb-4">
                        <div class="text-4xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] my-1">
                            ${r.planetSymbol}
                        </div>
                        <span class="px-5 py-1.5 rounded-full text-xs ${r.badgeBg} uppercase tracking-widest shadow-2xl border border-white/40">
                            ✨ ${r.text} ✨
                        </span>
                    </div>
                    
                    <!-- Avatar cá nhân nổi khối với viền hành tinh xanh -->
                    <div class="relative my-2">
                        <div class="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 rounded-2xl blur-xl opacity-80 animate-pulse"></div>
                        <div class="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl border-2 ${r.ringColor} transform group-hover:scale-110 transition-transform duration-300">
                            ${initial}
                        </div>
                    </div>

                    <h4 class="text-2xl font-black text-white tracking-wide truncate w-full mt-3 mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">${escapeHTML(user.name)}</h4>
                    <p class="text-xs text-cyan-200 font-bold mb-4 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 shadow-inner">${escapeHTML(user.className || 'Học sinh')}</p>
                    
                    <div class="w-full bg-slate-950/90 py-3.5 px-4 rounded-2xl border border-slate-800 shadow-inner group-hover:border-cyan-500/60 transition-colors">
                        <span class="text-[11px] font-extrabold text-cyan-300 uppercase tracking-wider block mb-1">${r.title}</span>
                        <span class="text-xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.9)]">${user.ccs || 0} CCS</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const myRankIdx = validUsers.findIndex(u => isLogged && (u.id === currentId || u.name === currentName));
    const myRankNum = myRankIdx !== -1 ? myRankIdx + 1 : '-';
    const activeScore = typeof window.getGlobalScore === 'function' ? window.getGlobalScore() : 0;
    const myScore = isLogged && myRankIdx !== -1 ? validUsers[myRankIdx].ccs : (isLogged ? activeScore : 0);

    container.innerHTML = `
        <div class="space-y-6">
            <div class="flex justify-between items-center pb-2">
                <div>
                    <h2 class="text-2xl font-black text-white flex items-center gap-3">
                        <span class="text-amber-400">🌟 Bảng Xếp Hạng Công Dân Số</span>
                        <span class="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">TỔNG ${validUsers.length} HỌC SINH</span>
                    </h2>
                    <p class="text-xs text-slate-400 mt-1">Hệ thống tự động vinh danh Top 3 thành viên chính thức thời gian thực.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${top3HTML || '<div class="col-span-3 text-center text-xs text-slate-500 py-6">Chưa có thành viên nào đăng nhập xếp hạng.</div>'}
            </div>

            ${restUsers.length > 0 ? `
                <div class="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
                    <h4 class="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">DANH SÁCH THI ĐUA CÁ NHÂN (${restUsers.length} Học Sinh)</h4>
                    <div class="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                        ${restHTML}
                    </div>
                </div>
            ` : ''}

            <div class="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/40">
                        #${myRankNum}
                    </div>
                    <div>
                        <div class="text-xs font-bold text-white">Thứ hạng của bạn (${escapeHTML(currentName)})</div>
                        <div class="text-[10px] text-amber-300">${isLogged ? 'Thành viên chính thức' : 'Khách không tham gia xếp hạng'}</div>
                    </div>
                </div>
                <div class="text-sm font-black text-amber-400">${isLogged ? myScore : 0} CCS</div>
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
        // NẾU ĐÃ ĐĂNG NHẬP THÌ MỚI ĐỒNG BỘ DỮ LIỆU LÊN FIREBASE
        if (isLogged) {
            const userId = (currentUser.email || 'user').replace(/[^a-zA-Z0-9]/g, "_");
            window.db.collection("users").doc(userId).set({
                name: currentUser.name || currentUser.email || 'Thành viên',
                className: currentUser.classRoom || 'Học sinh',
                ccs: activeScore,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true }).catch(() => {});
        }

        // LẮNG NGHE VÀ LỌC BỎ KHÁCH KHỎI DANH SÁCH HIỂN THỊ
        window.db.collection("users")
            .orderBy("ccs", "desc")
            .onSnapshot((snapshot) => {
                let realUsers = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const name = data.name || "Học sinh";
                    // Chỉ nạp vào danh sách nếu không phải là Khách
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