// ==========================================
// MÔ-ĐUN BẢNG XẾP HẠNG THI ĐUA CÁ NHÂN (RACE UNIVERSE)
// ==========================================

function getOrCreateGuestInfo() {
    let guestId = sessionStorage.getItem("cyber_guest_id");
    let guestName = sessionStorage.getItem("cyber_guest_name");
    
    if (!guestId) {
        const randCode = Math.floor(1000 + Math.random() * 9000); // Tạo 4 số ngẫu nhiên từ 1000 đến 9999
        guestId = "guest_" + Date.now() + "_" + randCode;
        guestName = "Khách Google #" + randCode; // Tên hiển thị kèm mã số riêng biệt
        
        sessionStorage.setItem("cyber_guest_id", guestId);
        sessionStorage.setItem("cyber_guest_name", guestName);
    }
    
    return { id: guestId, name: guestName };
}

window.renderPersonalLeaderboard = function(users) {
    const container = document.getElementById('race-universe-container');
    if (!container || !users) return;

    users.sort((a, b) => (Number(b.ccs) || 0) - (Number(a.ccs) || 0));

    const top3 = users.slice(0, 3);
    const restUsers = users.slice(3);

    const savedUser = localStorage.getItem("cyberUser");
    let currentUser = null;
    if (savedUser) { try { currentUser = JSON.parse(savedUser); } catch(e) {} }
    
    const guestInfo = getOrCreateGuestInfo();
    const currentName = (currentUser && currentUser.loggedIn) ? (currentUser.name || currentUser.email) : guestInfo.name;
    const currentId = (currentUser && currentUser.loggedIn && currentUser.email) ? currentUser.email.replace(/[^a-zA-Z0-9]/g, "_") : guestInfo.id;

    let top3HTML = top3.map((user, idx) => {
        const ranks = [
            { text: '🥇 HẠNG 1', border: 'border-amber-400/50', bg: 'bg-amber-400/10', title: 'Thủ Lĩnh Tử Tế' },
            { text: '🥈 HẠNG 2', border: 'border-slate-400/50', bg: 'bg-slate-400/10', title: 'Sứ Giả An Toàn Mạng' },
            { text: '🥉 HẠNG 3', border: 'border-amber-600/50', bg: 'bg-amber-600/10', title: 'Ngôi Sao Đạo Đức Số' }
        ];
        const r = ranks[idx] || ranks[2];
        const initial = (user.name || 'U').charAt(0).toUpperCase();

        return `
            <div class="bg-slate-900/90 border ${r.border} p-5 rounded-3xl shadow-xl flex flex-col items-center justify-between text-center relative overflow-hidden">
                <span class="px-3 py-1 rounded-full text-[10px] font-black ${r.bg} text-white border ${r.border} mb-3 uppercase tracking-wider">
                    ${r.text}
                </span>
                <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-2xl font-black text-white shadow-lg mb-2">
                    ${initial}
                </div>
                <h4 class="text-base font-black text-white truncate w-full">${user.name}</h4>
                <p class="text-[11px] text-slate-400 mb-3">${user.className || 'Học sinh'}</p>
                <div class="w-full bg-slate-950/80 py-2 rounded-xl border border-slate-800">
                    <span class="text-xs font-bold text-slate-400 block">${r.title}</span>
                    <span class="text-sm font-black text-emerald-400">${user.ccs || 0} CCS</span>
                </div>
            </div>
        `;
    }).join('');

    let restHTML = restUsers.map((user, idx) => {
        const rankNumber = idx + 4;
        const isMe = user.id === currentId || user.name === currentName;

        return `
            <div class="flex items-center justify-between p-3.5 ${isMe ? 'bg-indigo-950/40 border-indigo-500/50' : 'bg-slate-900/60 border-slate-800/80'} rounded-2xl border hover:border-slate-700 transition">
                <div class="flex items-center gap-3">
                    <span class="text-xs font-bold text-slate-400 w-8 text-center">#${rankNumber}</span>
                    <div>
                        <div class="text-xs font-bold ${isMe ? 'text-indigo-300' : 'text-white'}">${user.name} ${isMe ? '(Bạn)' : ''}</div>
                        <div class="text-[10px] text-slate-400">${user.className || 'Học sinh'}</div>
                    </div>
                </div>
                <span class="text-xs font-black text-emerald-400">${user.ccs || 0} CCS</span>
            </div>
        `;
    }).join('');

    const myRankIdx = users.findIndex(u => u.id === currentId || u.name === currentName);
    const myRankNum = myRankIdx !== -1 ? myRankIdx + 1 : '-';
    const myScore = typeof window.getGlobalScore === 'function' ? window.getGlobalScore() : (myRankIdx !== -1 ? users[myRankIdx].ccs : 0);

    container.innerHTML = `
        <div class="space-y-6">
            <div class="flex justify-between items-center pb-2">
                <div>
                    <h2 class="text-2xl font-black text-white flex items-center gap-3">
                        <span class="text-amber-400">🌟 Bảng Xếp Hạng Công Dân Số</span>
                        <span class="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">TỔNG ${users.length} HỌC SINH</span>
                    </h2>
                    <p class="text-xs text-slate-400 mt-1">Hệ thống tự động vinh danh Top 3 và cập nhật vị trí xếp hạng thời gian thực.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${top3HTML}
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
                        <div class="text-xs font-bold text-white">Thứ hạng hiện tại (${currentName})</div>
                        <div class="text-[10px] text-amber-300">Công Dân Số Tích Cực</div>
                    </div>
                </div>
                <div class="text-sm font-black text-amber-400">${myScore} CCS</div>
            </div>
        </div>
    `;
};

window.initPersonalLeaderboardListener = function() {
    const savedUser = localStorage.getItem("cyberUser");
    let currentUser = null;
    if (savedUser) { try { currentUser = JSON.parse(savedUser); } catch(e) {} }

    const activeScore = typeof window.getGlobalScore === 'function' ? window.getGlobalScore() : 0;
    const guestInfo = getOrCreateGuestInfo();

    const localUser = (currentUser && currentUser.loggedIn) ? {
        id: (currentUser.email || 'current_user').replace(/[^a-zA-Z0-9]/g, "_"),
        name: currentUser.name || currentUser.email || 'Thành viên',
        className: currentUser.classRoom || 'Học sinh',
        ccs: activeScore
    } : {
        id: guestInfo.id,
        name: guestInfo.name,
        className: 'Khách',
        ccs: activeScore
    };

    if (window.db) {
        window.db.collection("users").doc(localUser.id).set({
            name: localUser.name,
            className: localUser.className,
            ccs: localUser.ccs,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).catch(() => {});

        window.db.collection("users")
            .orderBy("ccs", "desc")
            .onSnapshot((snapshot) => {
                let realUsers = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    realUsers.push({
                        id: doc.id,
                        name: data.name || "Học sinh",
                        className: data.className || "Chưa cập nhật",
                        ccs: Number(data.ccs) || 0
                    });
                });

                const existingIdx = realUsers.findIndex(u => u.id === localUser.id);
                if (existingIdx !== -1) {
                    realUsers[existingIdx].ccs = Math.max(realUsers[existingIdx].ccs, localUser.ccs);
                } else {
                    realUsers.push(localUser);
                }

                realUsers.sort((a, b) => b.ccs - a.ccs);
                window.renderPersonalLeaderboard(realUsers);
            }, (err) => {
                window.renderPersonalLeaderboard([localUser]);
            });
    } else {
        window.renderPersonalLeaderboard([localUser]);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (typeof window.initPersonalLeaderboardListener === 'function') {
            window.initPersonalLeaderboardListener();
        }
    }, 200);
});