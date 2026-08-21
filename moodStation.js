// ==========================================
// CẤU HÌNH DANH SÁCH NHẠC & PLAYLIST
// ==========================================
const MUSIC_PLAYLISTS = {
    energetic: [
        { title: "Sôi Động 1", src: "./NHACSOIDONG/soidong1.mp3" },
        { title: "Sôi Động 2", src: "./NHACSOIDONG/soidong2.mp3" },
        { title: "Sôi Động 3", src: "./NHACSOIDONG/soidong3.mp3" }
    ],
    gentle: [
        { title: "Bài Nhạc Nhẹ 1", src: "./nhacnhe1.mp3" },
        { title: "Bài Nhạc Nhẹ 2", src: "./nhacnhe2.mp3" }
    ]
};
let currentPlaylistType = 'energetic';
let currentSongIndex = 0;

window.playMusicType = function(type) {
    currentPlaylistType = type;
    currentSongIndex = 0;
    const list = MUSIC_PLAYLISTS[currentPlaylistType];
    if (!list || list.length === 0) return;
    const song = list[currentSongIndex];
    const audio = document.getElementById('bg-audio');
    if (!audio || !song) return;
    audio.src = song.src;
    audio.load();
    audio.play().then(() => {
        if (type === 'energetic') {
            const status = document.getElementById('energetic-status');
            if (status) status.innerText = "▶ " + song.title;
        } else if (type === 'gentle') {
            const status = document.getElementById('gentle-status');
            if (status) status.innerText = "▶ " + song.title;
        }
    }).catch((error) => { console.log("Lỗi:", error); });
};

window.nextMoodMusic = function() {
    const list = MUSIC_PLAYLISTS[currentPlaylistType];
    if (!list || list.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % list.length;
    const song = list[currentSongIndex];
    const audio = document.getElementById('bg-audio');
    if (!audio || !song) return;
    audio.src = song.src;
    audio.load();
    audio.play().then(() => {
        if (currentPlaylistType === 'energetic') {
            const status = document.getElementById('energetic-status');
            if (status) status.innerText = "▶ " + song.title;
        } else if (currentPlaylistType === 'gentle') {
            const status = document.getElementById('gentle-status');
            if (status) status.innerText = "▶ " + song.title;
        }
    });
};
// ==========================================
// MÔ-ĐUN: TRẠM SẠC CẢM XÚC - TỐI ƯU GIAO DIỆN & TẢI TRỌN BỘ TÍNH NĂNG
// ==========================================

if (!document.getElementById('mood-glow-style')) {
    const styleElem = document.createElement('style');
    styleElem.id = 'mood-glow-style';
    styleElem.innerHTML = `
        @keyframes moodGlowRun {
            0% { border-color: #fbbf24; box-shadow: 0 0 20px rgba(251, 191, 36, 0.6); }
            33% { border-color: #f43f5e; box-shadow: 0 0 20px rgba(244, 63, 94, 0.6); }
            66% { border-color: #38bdf8; box-shadow: 0 0 20px rgba(56, 189, 248, 0.6); }
            100% { border-color: #fbbf24; box-shadow: 0 0 20px rgba(251, 191, 36, 0.6); }
        }
        .mood-glow-border { animation: moodGlowRun 4s linear infinite !important; }

        @keyframes notebookGlowPulse {
            0% { box-shadow: 0 0 5px #38bdf8; transform: scale(1); }
            50% { box-shadow: 0 0 35px #f43f5e, 0 0 50px #fbbf24; transform: scale(1.1); }
            100% { box-shadow: 0 0 5px #38bdf8; transform: scale(1); }
        }
        .notebook-hit-effect { animation: notebookGlowPulse 0.3s ease-out !important; }

        .cyber-header-glow { text-shadow: 0 0 10px rgba(52, 211, 153, 0.6), 0 0 20px rgba(52, 211, 153, 0.3); }
        .title-glow-happy { color: #fef08a; text-shadow: 0 0 12px rgba(251, 191, 36, 0.8); }
        .title-glow-chill { color: #6ee7b7; text-shadow: 0 0 12px rgba(52, 211, 153, 0.8); }
        .title-glow-stressed { color: #f472b6; text-shadow: 0 0 12px rgba(244, 63, 94, 0.8); }
        .title-glow-tired { color: #a78bfa; text-shadow: 0 0 12px rgba(167, 139, 250, 0.8); }
    `;
    document.head.appendChild(styleElem);
}

// CẤU HÌNH HIỆU ỨNG HẠT
const MOOD_PARTICLE_CONFIGS = {
    happy: { icons: ['⚡', '🔥', '🌟', '💥', '✨', '🚀'], count: 75, speedMin: 1.8, speedMax: 3.5 },
    chill: { icons: ['🌸', '🍃', '🌿', '🌱', '☕', '✨'], count: 70, speedMin: 2.5, speedMax: 5.5 },
    stressed: { icons: ['✨', '💧', '💫', '🌈', '🕊️', '🍃'], count: 70, speedMin: 2.5, speedMax: 4.8 },
    tired: { icons: ['💖', '🌙', '🧸', '🌸', '✨', '🛋️'], count: 70, speedMin: 3.0, speedMax: 6.0 }
};

let particleAnimationId = null;
let particlesArray = [];

window.launchMoodParticles = function(moodKey) {
    let canvas = document.getElementById('mood-particles-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'mood-particles-canvas';
        canvas.className = 'fixed inset-0 pointer-events-none z-[50]';
        document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const config = MOOD_PARTICLE_CONFIGS[moodKey] || MOOD_PARTICLE_CONFIGS.happy;
    particlesArray = [];

    for (let i = 0; i < config.count; i++) {
        particlesArray.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 12 + 14,
            speedY: Math.random() * (config.speedMax - config.speedMin) + config.speedMin,
            speedX: (Math.random() - 0.5) * 1.5,
            icon: config.icons[Math.floor(Math.random() * config.icons.length)],
            opacity: 1,
            life: 2
        });
    }

    if (particleAnimationId) cancelAnimationFrame(particleAnimationId);

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let activeParticles = 0;

        for (let i = 0; i < particlesArray.length; i++) {
            let p = particlesArray[i];
            if (p.life <= 0) continue;

            p.y -= p.speedY;
            p.x += p.speedX;

            if (p.y < -30) {
                p.life -= 1;
                if (p.life > 0) {
                    p.y = canvas.height + 20;
                    p.x = Math.random() * canvas.width;
                }
            }

            ctx.globalAlpha = p.opacity;
            ctx.font = `${p.size}px sans-serif`;
            ctx.fillText(p.icon, p.x, p.y);
            activeParticles++;
        }

        if (activeParticles > 0) {
            particleAnimationId = requestAnimationFrame(animateParticles);
        } else {
            window.stopMoodParticles();
        }
    }

    animateParticles();
};

window.stopMoodParticles = function() {
    if (particleAnimationId) {
        cancelAnimationFrame(particleAnimationId);
        particleAnimationId = null;
    }
    const canvas = document.getElementById('mood-particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
};

// KHO NỘI DUNG THÔNG ĐIỆP
const MOOD_MESSAGES = {
    happy: {
        title: "🎉🚀 CHÚC MỪNG BẠN ĐANG TRÀN ĐẦY NĂNG LƯỢNG TÍCH CỰC & TỰ TIN! ⚡🌟",
        avatar: "🔥",
        glowClass: "title-glow-happy",
        quotes: [
            "🔥 Tuyệt vời lắm! Năng lượng dồi dào hôm nay chính là chiếc chìa khóa vạn năng giúp bạn chinh phục mọi mục tiêu khó khăn nhất. Hãy biến nguồn cảm hứng rực rỡ này thành chuỗi hành động bứt phá và truyền nguồn năng lượng ấm áp đến bạn bè xung quanh nhé! 🚀",
            "✨ Bạn đang ở trạng thái tỏa sáng nhất của bản thân! Nụ cười rạng rỡ cùng sự tự tin chính là món quà tuyệt vời nhất bạn dành cho ngày hôm nay. Hãy giữ vững ngọn lửa nhiệt huyết này để kiến tạo nên những thành quả vô cùng xứng đáng! 💪",
            "🌟 Khi tâm trí tràn đầy năng lượng tích cực, mọi thử thách trước mắt chỉ còn là cơ hội để bạn thể hiện bản lĩnh. Chúc bạn có một ngày thi đua thật bứt phá, ghi trọn từng khoảnh khắc đáng nhớ và luôn là phiên bản tự tin nhất nhé! 🎉",
            "⚡ Bạn chính là nguồn năng lượng rực rỡ lan tỏa niềm vui đến mọi người! Hãy tận dụng tinh thần sung sức này để giải quyết dứt điểm các bài tập khó và vươn tới những mục tiêu cao hơn. Cố lên, thành công đang chào đón bạn! 🏆",
            "🎯 Sự quyết tâm và thần thái tự tin hôm nay của bạn thực sự tuyệt vời! Đừng ngần ngại thử sức với những mục tiêu mới, vì nguồn năng lượng lúc này sẽ giúp bạn dễ dàng vượt qua mọi rào cản. Chúc bạn có một ngày làm việc tràn ngập niềm vui! 🚀",
            "🚀 Năng lượng bứt phá trong bạn hôm nay như một ngọn lửa hồng xua tan mọi e ngại. Hãy luôn tin vào khả năng vô hạn của chính mình, bước những bước thật vững chắc và thu về những điểm số tuyệt vời nhé! 💥",
            "💎 Tự tin chính là thứ trang sức lộng lẫy nhất mà bạn đang khoác lên người. Hôm nay, hãy cứ là chính mình, làm việc hết sức, vui chơi hết mình và viết nên câu chuyện đầy tự hào của riêng bạn! 🌈",
            "🎉 Một tinh thần phấn khởi là bước khởi đầu hoàn hảo cho mọi thắng lợi. Hãy giữ trọn ngọn lửa đam mê, sẵn sàng sẻ chia kiến thức với bạn bè và đón nhận một ngày thi đua thật ngập tràn thành công! ⚡",
            "🌈 Khi bạn mỉm cười và tỏa ra năng lượng tích cực, vũ trụ như đang mỉm cười lại với bạn. Chúc bạn một ngày tràn đầy những bất ngờ thú vị, những cơ hội mới và những niềm vui không giới hạn! ✨",
            "🔥 Sức mạnh nội tại của bạn đang ở thời điểm đỉnh cao! Đừng chần chừ trước bất kỳ ước mơ nào, hãy bắt tay vào thực hiện ngay hôm nay vì bạn hoàn toàn đủ khả năng chinh phục tất cả! 🌟",
            "🏆 Nụ cười rạng rỡ của bạn hôm nay chính là liều thuốc tinh thần quý giá cho cả tập thể. Hãy tiếp tục giữ vững phong độ đỉnh cao này để gặt hái thêm thật nhiều hoa trái thành công nhé! 🚀",
            "✨ Ngày hôm nay sinh ra là để dành cho sự bứt phá của bạn! Hãy dũng cảm bước ra khỏi vùng an toàn, đón nhận mọi cơ hội và để ngọn lửa nhiệt huyết dẫn đường cho từng quyết định đúng đắn! 💪",
            "🌟 Khí chất tự tin và tinh thần lạc quan sẽ mở ra cho bạn những cánh cửa kỳ diệu. Chúc bạn một ngày học tập và trải nghiệm thật tràn đầy cảm hứng, thu nạp thêm vô vàn bài học hay! 🎉",
            "⚡ Năng lượng tích cực không chỉ giúp bạn làm việc hiệu quả mà còn thắp sáng không gian xung quanh. Cảm ơn bạn vì đã mang đến một nguồn sống tươi trẻ và đầy nhiệt huyết cho ngày hôm nay! 🏆",
            "🎯 Mọi mục tiêu dù lớn đến đâu cũng bắt đầu từ ngọn lửa quyết tâm trong tim. Hãy giữ vững sự tập trung, tận dụng trọn vẹn nguồn sức mạnh này để vượt qua mọi mốc điểm số mong ước nhé! 💥",
            "🚀 Bạn đang tiến những bước rất dài trên con đường hoàn thiện bản thân. Hãy luôn tự hào về năng lượng rực rỡ này, tiếp tục lan tỏa sự tử tế và ghi dấu ấn đậm nét trong ngày hôm nay! 💎",
            "🌈 Niềm vui hôm nay sẽ là bàn đệm vững chắc cho những ước mơ ngày mai. Hãy tận hưởng từng khoảnh khắc tuyệt vời này, luôn tươi cười và tin tưởng tuyệt đối vào hành trình rực rỡ phía trước! ✨",
            "🎉 Không có giới hạn nào cho một tâm trí luôn tràn đầy sự tự tin và lòng nhiệt huyết. Chúc bạn chiến thắng mọi thử thách, chinh phục thêm nhiều đỉnh cao mới và luôn là niềm tự hào của tập thể! ⚡",
            "🔥 Cảm giác sung sức hôm nay thật tuyệt vời phải không? Hãy lưu giữ cảm xúc tươi đẹp này, dùng nó để truyền năng lượng cho những người bạn đang cần sự động viên xung quanh nhé! 🌟",
            "✨ Bạn là minh chứng sống động cho việc khi chúng ta sống tích cực, mọi điều tốt đẹp sẽ tự tìm đến. Chúc bạn một ngày rực rỡ sắc màu, ngập tràn tiếng cười và thật nhiều thành tựu vượt bậc! 🚀"
        ]
    },
    chill: {
        title: "🌿🧘 TRẠM TĨNH LẶNG - BÌNH THẢN TẬN HƯỞNG NHỮNG PHÚT GIÂY ÊM ĐỀM ☕🎧",
        avatar: "☕",
        glowClass: "title-glow-chill",
        quotes: [
            "🌿 Một tâm trí tĩnh lặng chính là điểm tựa vững chắc nhất của sức mạnh nội tại. Hãy thả lỏng đôi vai, lắng nghe từng giai điệu Lofi êm dịu và nhâm nhi sự bình yên này để cảm nhận vẻ đẹp dịu dàng của ngày mới nhé! 🍃",
            "☕ Thư thái không có nghĩa là dừng lại, mà là chắt lọc những điều tử tế nhất để nuôi dưỡng tâm hồn. Hít một hơi thật sâu, thở ra nhẹ nhàng và tin rằng mọi việc rồi sẽ được thu xếp trọn vẹn theo cách tốt đẹp nhất! 🕊️",
            "🌸 Cuộc sống không cần lúc nào cũng phải vội vã. Đôi khi lắng dừng lại một nhịp để quan sát thế giới xung quanh lại giúp tâm trí bạn trở nên minh mẫn và sâu sắc hơn rất nhiều. Chúc bạn một ngày tràn ngập an nhiên! ✨",
            "🎧 Thả mình vào không gian êm dịu, tạm gạt bỏ những xô xập bên ngoài để tìm lại sự cân bằng hoàn hảo. Bạn đang đi đúng hướng trên hành trình của mình, cứ nhẹ nhàng và kiên định tiến về phía trước nhé! 🌧️",
            "🍃 Bình thản đón nhận mọi thứ với nụ cười ấm áp trên môi. Khoảng thời gian yên bình quý giá này sẽ sạc đầy nguồn năng lượng thanh lành cho tâm hồn, giúp bạn luôn vững vàng và tự tại trong mọi hoàn cảnh! ☕",
            "🕊️ Sự an tĩnh trong tâm hồn chính là chiếc giáp bảo vệ bạn trước mọi giông bão. Hãy tận hưởng tách trà ấm, lắng nghe nhịp thở của chính mình và cảm nhận nguồn năng lượng bình yên đang lan tỏa! 🌿",
            "✨ Nhẹ nhàng bước đi trên con đường mình chọn mà không cần so sánh với bất kỳ ai. Mọi thứ đang diễn ra đúng thời điểm, hãy giữ trọn sự thong dong và trân trọng từng phút giây dịu ngọt này nhé! 🌸",
            "☕ Khi bạn biết dành cho mình những khoảng lặng bình yên, trí tuệ và sự sáng tạo sẽ tự khắc đơm hoa. Chúc bạn một không gian thật chill, nuôi dưỡng những ý tưởng tuyệt vời nhất cho tương lai! 🍃",
            "🧘 Cân bằng cảm xúc chính là đỉnh cao của sự trưởng thành. Hãy tiếp tục duy trì tâm thế thanh thản này, mỉm cười trước những khó khăn nhỏ và tận hưởng trọn vẹn vẻ đẹp tinh khôi của ngày hôm nay! 🕊️",
            "🌿 Hãy gạt bỏ mọi muộn phiền ngoài cánh cửa, nhắm mắt lại trong 30 giây để nghe tiếng mưa rơi hay tiếng nhạc êm dịu. Bạn xứng đáng có được sự bình yên trọn vẹn nhất trong tâm hồn! 🌧️",
            "🍃 Một ngày bình lặng không có nghĩa là đơn điệu, mà là ngày bạn sống sâu sắc nhất với chính mình. Chúc bạn luôn giữ vững sự an nhiên, bao dung với bản thân và đón nhận những niềm vui bình dị! ☕",
            "🌸 Hãy để tâm trí bạn nhẹ nhàng như một chiếc lá thu trôi trên dòng nước mát. Không gượng ép, không hối hả, chỉ có sự bình yên đong đầy và tình yêu thương dịu dàng dành cho cuộc sống! ✨",
            "🎧 Âm nhạc thanh lành cùng một góc nhỏ yên tĩnh sẽ giúp bạn gột rửa mọi bụi mặn của mệt mỏi. Hãy cho phép mình thư giãn trọn vẹn trước khi bắt đầu những bước tiến vững chắc tiếp theo nhé! 🌿",
            "🕊️ Tĩnh lặng giúp bạn nhìn rõ hơn những giá trị đích thực quanh mình. Hãy cảm nhận tình ấm áp từ những điều giản dị nhất và giữ cho trái tim mình luôn đong đầy sự tử tế thanh khiết! 🍃",
            "✨ Mọi thứ trên đời đều có nhịp điệu riêng của nó, và nhịp điệu thong dong của bạn lúc này thật đẹp. Chúc bạn luôn tự tin giữ vững khoảng không gian bình yên này để sống một đời an tĩnh! ☕",
            "☕ Thưởng thức trọn vẹn khoảnh khắc hiện tại chính là bí mật của hạnh phúc. Chúc bạn một khoảng thời gian thật thư thái, tâm trí nhẹ nhàng như mây trời và tim đong đầy niềm vui lắng đọng! 🌸",
            "🌿 Đôi khi thành công lớn nhất chỉ đơn giản là giữ được sự thanh thản trước mọi biến động. Bạn đang làm rất tốt, hãy tự thưởng cho mình nụ cười dịu dàng và tiếp tục tận hưởng ngày hôm nay nhé! 🕊️",
            "🧘 Hãy thả lỏng từ vầng trán, đôi bờ vai cho đến từng ngón tay. Mọi áp lực đều có thể tan biến khi bạn quyết định trao cho mình quyền được sống chậm lại và yêu thương bản thân nhiều hơn! ✨",
            "🍃 Sự tĩnh lặng là nơi nuôi dưỡng những ước mơ sâu sắc nhất. Chúc bạn có một khoảng thời gian lắng đọng thật ý nghĩa, nạp đầy sự minh mẫn để sẵn sàng cho những hành trình rực rỡ! ☕",
            "🌸 Giữa thế giới hối hả, một tâm hồn biết dừng lại để chill là một tâm hồn vô cùng giàu có. Hãy giữ mãi nét an nhiên này để luôn cảm nhận được vẻ đẹp chân thật nhất của cuộc sống nhé! 🌿"
        ]
    },
    stressed: {
        title: "💬☕ GÓC THẤU HIỂU - BẠN ĐÃ CỐ GẮNG NHIỀU RỒI, HÃY MỞ LÒNG VÀ THẢ LỎNG NHÉ 🧘‍♀️🌈",
        avatar: "☕",
        glowClass: "title-glow-stressed",
        quotes: [
            "☕ Áp lực lúc này chỉ là tạm thời, nhưng sự nỗ lực kiên cường của bạn là giá trị bền vững mãi mãi. Đừng quá khắt khe với bản thân, hãy uống một ngụm nước ấm, thả lỏng cơ thể và cho phép mình được nghỉ ngơi đôi phút nhé! 💖",
            "🌈 Mọi vướng mắc phức tạp đến đâu rồi cũng sẽ tìm ra lối gỡ khi tâm trí bạn bình tĩnh trở lại. Bạn vốn dĩ rất giỏi giang và mạnh mẽ hơn những gì mình nghĩ nhiều đấy, hãy tin tưởng vào bản thân thêm một chút nữa nào! 🌟",
            "🕊️ Khi cảm thấy đôi vai nặng trĩu áp lực, hãy nhớ rằng bạn không bao giờ phải gánh vác mọi thứ một mình. Hít thở thật sâu, mở lòng chia sẻ và tự thưởng cho bản thân một khoảng lặng xoa dịu cần thiết nhé! 🍃",
            "🌸 Áp lực tạo nên kim cương, nhưng ngay cả kim cương cũng cần thời gian nghỉ ngơi để đạt độ trong suốt nhất. Bạn đã cố gắng rất chăm chỉ rồi, bây giờ là lúc thả lỏng tâm trí để lấy lại sự cân bằng vốn có! ✨",
            "💬 Cho phép bản thân nghỉ tạm một nhịp. Đừng để những lo toan hiện tại làm mờ đi những nỗ lực tuyệt vời mà bạn đã bền bỉ xây dựng suốt thời gian qua. Mọi chuyện rồi sẽ sớm ổn định và tươi sáng trở lại! 🌈",
            "☕ Căng thẳng chỉ là một cơn mưa rào bất chợt, nó đến rồi sẽ nhanh chóng đi qua nhường chỗ cho bầu trời xanh ngắt. Hãy nhắm mắt lại trong vài giây, thả lỏng trán và mỉm cười xoa dịu chính mình nhé! 💖",
            "🌟 Bạn không cần phải luôn luôn hoàn hảo hay đáp ứng kỳ vọng của tất cả mọi người. Sự nỗ lực chân thành mỗi ngày của bạn đã là điều vô cùng đáng tự hào rồi, hãy nhẹ nhàng với bản thân hơn một chút! 🕊️",
            "🌈 Hãy nhớ rằng những bước lùi nhỏ đôi khi chỉ là đà nhảy cho bước tiến lớn hơn. Đừng để sự dồn dập khiến bạn mệt mỏi, hãy chia nhỏ công việc ra và giải quyết từng chút một thật thong thả nhé! ✨",
            "🍃 Khi chiếc ly quá đầy, hãy rót bớt nước ra. Khi tâm trí quá tải, hãy trút bỏ những lo âu bằng cách hít thở thật sâu và lắng nghe một bản nhạc nhẹ. Mọi khó khăn rồi sẽ tìm thấy hướng đi đúng đắn! ☕",
            "💖 Bạn đã đi được một chặng đường rất dài và vượt qua biết bao nhiêu thử thách lớn nhỏ. Đừng lo lắng quá nhiều về tương lai, hãy tập trung vào khoảnh khắc này và tin rằng mình sẽ làm tốt! 🌸",
            "🕊️ Không sao cả nếu hôm nay bạn cảm thấy mọi thứ hơi rối bời. Đó chỉ là tín hiệu báo rằng cơ thể bạn đang cần một khoảng nghỉ xả hơi. Hãy uống chút nước, vận động nhẹ và thả lỏng tâm trí nào! 🍃",
            "✨ Mọi nút thắt đều có thể tháo gỡ khi bạn dừng lại và giữ sự bình tĩnh. Đừng ép mình phải tìm ra câu trả lời ngay lập tức, hãy cho tâm trí thời gian thư giãn và mọi thứ sẽ trở nên rõ ràng! 🌈",
            "☕ Bạn mạnh mẽ hơn bất kỳ áp lực nào đang bủa vằn xung quanh. Hãy gạt bỏ bớt những tiêu chuẩn quá nghiêm khắc, ôm lấy bản thân và thầm nói: 'Mình đã làm rất tốt, mọi chuyện rồi sẽ đâu vào đó!' 💖",
            "🌟 Khi đám mây căng thẳng xám xịt kéo đến, hãy nhớ rằng mặt trời rực rỡ vẫn luôn ở ngay sau đó. Hãy giữ niềm tin, mỉm cười nhẹ nhàng và bước từng bước vững chắc qua khoảng thời gian này nhé! 🕊️",
            "🌈 Căng thẳng giống như việc bạn cố giữ một chiếc ly nặng trên tay quá lâu. Hãy đặt chiếc ly xuống, nghỉ ngơi đôi chút rồi hẵng tiếp tục. Bạn sẽ thấy mình tràn đầy sức mạnh trở lại! ✨",
            "💬 Đừng so sánh hành trình của mình với người khác khi bạn đang mệt mỏi. Mỗi người có một nhịp điệu riêng, và bạn đang tiến bộ lên từng ngày bằng chính sự kiên trì đáng trân trọng của mình! 💖",
            "🌸 Một hơi thở sâu có thể xua tan một nửa nỗi lo lắng. Hãy dừng mọi việc trong 1 phút, hít vào sự bình an và thở ra mọi áp lực tích tụ. Bạn hoàn toàn làm chủ được cảm xúc của mình! 🍃",
            "🍃 Mọi bài kiểm tra hay thử thách rồi cũng sẽ trôi qua, chỉ có sự kiên cường và sức khỏe của bạn là quan trọng nhất. Hãy ưu tiên chăm sóc bản thân trước, mọi việc rồi sẽ có giải pháp êm đẹp! ☕",
            "💖 Bạn là một chiến binh tuyệt vời đã đứng vững qua rất nhiều ngày khó khăn. Hãy tin vào bản lĩnh của mình, cho phép bản thân được thả lỏng và đón nhận những năng lượng xoa dịu ấm áp nhé! ✨",
            "✨ Đừng quên rằng đằng sau bạn luôn có những lời chúc lành và sự đồng hành ấm áp. Hãy mỉm cười xua tan đi vẻ mệt mỏi, thở phào một cái thật dài và đón nhận những điều may mắn đang tới! 🌈"
        ]
    },
    tired: {
        title: "🛋️🌸 TRẠM AN ỦI - NẠP LẠI SIÊU PIN NĂNG LƯỢNG, BẠN XỨNG ĐÁNG ĐƯỢC NGHỈ NGƠI 🔋🌙",
        avatar: "😴",
        glowClass: "title-glow-tired",
        quotes: [
            "🛋️ Khi cảm thấy kiệt sức, biết cách dừng lại nghỉ ngơi chính là một loại năng lực chứ không phải sự yếu đuối. Bạn đã chiến đấu vô cùng dũng cảm suốt cả ngày dài rồi, hãy đặt sự mệt mỏi xuống và nạp lại pin ngay thôi! 🔋",
            "🌙 Bạn đã cống hiến hết sức mình và làm rất tốt rồi! Giờ là lúc thả lỏng toàn bộ cơ thể, nghe một bản nhạc nhẹ nhàng và tự thưởng cho mình một giấc ngủ thật êm gối để hồi phục lại siêu năng lượng nhé! 😴",
            "💖 Pin yếu thì sạc, người mệt thì nghỉ – đó là quy luật tự nhiên rất đỗi dịu dàng. Đừng ép buộc bản thân quá tải, hãy chăm sóc cơ thể thật tốt vì ngày mai sẽ lại là một hành trình mới tràn ngập ánh sáng đón chờ bạn! ✨",
            "🌸 Mọi sự mệt mỏi rồi sẽ trôi đi sau một nhịp tĩnh dưỡng trọn vẹn. Hãy tự ôm lấy bản thân và thì thầm: 'Hôm nay mình đã làm rất tuyệt vời!'. Trạm Sạc sẽ luôn ở đây để tiếp thêm năng lượng ấm áp cho bạn! 💖",
            "🔋 Hãy dành tặng cho bản thân một khoảng trời hoàn toàn thư thái. Tắt bớt những nghĩ suy, nhắm mắt lại và để năng lượng lành chữa lành từng tế bào trong bạn. Chúc bạn có những phút giây nghỉ ngơi thật sâu lắng! 🌙",
            "🛋️ Đừng tự trách mình vì cảm thấy mệt mỏi. Mệt mỏi chỉ là lời nhắc nhở dịu dàng từ cơ thể rằng bạn cần được yêu thương và sạc lại pin sau những giờ phút nỗ lực không ngừng nghỉ! 🌸",
            "😴 Hãy nhắm mắt lại, thả lỏng từng ngón tay, đôi chân và vầng trán. Hãy để cho mọi lo toan trôi đi theo làn gió đêm và đón nhận một giấc ngủ thật ngon lành để thức dậy tràn đầy sinh khí! 🌙",
            "✨ Một ngày vất vả đã khép lại sau lưng. Bạn đã kiên cường vượt qua tất cả để hoàn thành trách nhiệm của mình. Hãy tự hào về điều đó và yên tâm tận hưởng sự nghỉ ngơi trọn vẹn này nhé! 💖",
            "💖 Giống như một cái cây cần khoảng lặng mùa đông để đơm hoa vào mùa xuân, bạn cũng cần những phút giây nạp pin để bứt phá xa hơn. Đừng ngần ngại sống chậm lại và nuông chiều bản thân một chút! 🔋",
            "🌙 Tắm một vòi nước ấm, thưởng thức một ly sữa nóng và chui vào chiếc chăn êm ái. Mọi mệt mỏi của ngày hôm nay sẽ biến mất, nhường chỗ cho sự hồi sinh đầy mạnh mẽ vào ngày mai! 🛋️",
            "🌸 Cảm ơn bạn vì đã không bỏ cuộc ngay cả những lúc thấy mệt mỏi nhất. Hãy trao cho mình một cái ôm thật chặt và lời khen chân thành: 'Bạn đã làm rất tuyệt vời rồi, nghỉ ngơi thôi nào!' ✨",
            "🔋 Sức khỏe và sự an yên của bạn quan trọng hơn bất kỳ điều gì khác. Đừng ngần ngại gạt bỏ công việc sang một bên khi cơ thể cất tiếng gọi cần nghỉ ngơi. Bạn hoàn toàn xứng đáng được an an tĩnh tĩnh! 🌙",
            "🛋️ Không có cỗ máy nào chạy mãi mà không cần bảo dưỡng, và con người cũng vậy. Hãy coi khoảng thời gian nghỉ này là khoản đầu tư thông minh nhất để chuẩn bị cho những chiến thắng rực rỡ sắp tới! 💖",
            "😴 Hãy thả trôi mọi vướng bận theo từng nhịp thở dịu nhẹ. Đêm nay, hãy để cho tâm trí bạn được bình yên tuyệt đối và cơ thể được phục hồi trọn vẹn nguồn năng lượng tươi mới nhé! 🌸",
            "✨ Những giọt mồ hôi và sự mệt mỏi hôm nay sẽ trở thành chất liệu kiến tạo nên sự trưởng thành rực rỡ của bạn ngày mai. Hãy yên tâm nghỉ ngơi để chuẩn bị đón nhận những kết quả ngọt ngào! 🌙",
            "💖 Bạn đã làm việc thật chăm chỉ và kiên trì. Giờ đây, cả không gian ấm áp này là để dành riêng cho bạn. Hãy thả lỏng hoàn toàn và tận hưởng sự vỗ về dịu dàng từ Trạm Sạc nhé! 🔋",
            "🌙 Nghỉ ngơi cũng là một nghệ thuật sống. Hãy biến khoảng thời gian này thành trải nghiệm thật êm đềm bằng cách lắng nghe tiếng mưa rơi nhẹ và thả trôi những muộn phiền vào hư không! 🛋️",
            "🌸 Đừng quên rằng sau cơn mưa trời lại sáng, và sau một giấc ngủ ngon, mọi năng lượng tích cực sẽ tràn ngập trở lại. Chúc bạn có những giây phút thư giãn tuyệt vời nhất đêm nay! ✨",
            "🔋 Mỗi hạt năng lượng nạp lại hôm nay sẽ là ngọn đuốc thắp sáng cho những thành công ngày mai. Hãy tự hào về hành trình của mình và dành cho bản thân sự chăm sóc ngọt ngào nhất! 🌙",
            "💖 Cảm ơn bạn vì đã luôn cố gắng hết mình! Hãy khép lại ngày hôm nay bằng sự hài lòng, nhắm mắt lại trong sự bình yên và tin rằng ngày mai sẽ là một ngày rực rỡ và tràn đầy niềm vui! ✨"
        ]
    }
};

function getRandomQuote(moodKey) {
    const quotes = MOOD_MESSAGES[moodKey].quotes;
    return quotes[Math.floor(Math.random() * quotes.length)];
}

const MOOD_DATA = {
    happy: { label: "🔥 Full Pin", btnClass: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/40 text-amber-300" },
    chill: { label: "🌿 Thư Thái", btnClass: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/40 text-emerald-300" },
    stressed: { label: "☕ Hơi Áp Lực", btnClass: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/40 text-rose-300" },
    tired: { label: "😴 Cần Nạp Pin", btnClass: "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/40 text-indigo-300" }
};

let currentMood = 'happy';
let isRainPlaying = false;
let gameScore = 0;
let gameLevel = 1;
let gameTimer = null;

// GIAO DIỆN CHÍNH
window.renderMoodStation = function(containerId = 'mood-station-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <section class="mb-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div class="flex flex-col lg:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div class="space-y-1 text-center lg:text-left">
                    <div class="flex items-center justify-center lg:justify-start gap-2">
                        <span class="text-xs font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 cyber-header-glow flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> 🔋 TRẠM SẠC CẢM XÚC
                        </span>
                    </div>
                </div>

                <div class="flex flex-wrap items-center justify-center gap-2 shrink-0">
                    ${Object.keys(MOOD_DATA).map(key => {
                        const m = MOOD_DATA[key];
                        return `<button onclick="handleMoodSelect('${key}')" class="px-3 py-1.5 border text-xs font-bold rounded-xl transition-all hover:scale-105 cursor-pointer shadow-md ${m.btnClass}">${m.label}</button>`;
                    }).join('')}
                </div>
            </div>

            <div class="my-5 p-5 bg-slate-950/80 rounded-2xl border border-slate-800 relative flex items-center justify-center gap-3.5 text-center shadow-lg transition-all duration-300" id="mood-talk-box">
                <div class="text-2xl shrink-0" id="talk-avatar">💡</div>
                <div class="space-y-3 flex-1">
                    <h4 class="text-xs sm:text-sm font-black text-slate-300 tracking-wide" id="talk-title">
                        Mời bạn chọn trạng thái cảm xúc ở trên để Trạm Sạc gửi lời chúc & kích hoạt trò chơi tương ứng nhé! ✨
                    </h4>
                    
                    <div id="welcome-prompt" class="space-y-3">
                        <div class="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-1"></div>
                        <h2 class="text-sm sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 uppercase tracking-widest">
                            Sạc năng lượng ngày mới!<br> Tâm trạng của bạn hôm nay như thế nào?
                        </h2>
                    </div>
                    
                    <p class="text-xs text-slate-400 italic hidden" id="mood-talk-text"></p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div class="md:col-span-4 bg-slate-950/80 border border-slate-800/80 p-3 rounded-2xl flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="text-lg">🎮</span>
                        <span class="text-xs font-bold text-slate-200">Mini-Game Phản Xạ</span>
                    </div>
                    <button onclick="launchCurrentMoodGame()" class="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-indigo-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition hover:scale-105 cursor-pointer">
                        Chơi Trực Tiếp 🚀
                    </button>
                </div>

                <!-- 3 Ô ÂM NHẠC & ÂM THANH: SÔI ĐỘNG, NHẸ NHÀNG, ÂM THANH XANH -->
                <div class="md:col-span-8 bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-2">
                    <!-- Ô 1: NHẠC SÔI ĐỘNG -->
                    <div class="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1.5 rounded-xl flex-1 min-w-[150px]">
                        <button onclick="playMusicType('energetic')" class="w-7 h-7 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl flex items-center justify-center text-xs transition cursor-pointer font-black shrink-0">
                            <i class="fa-solid fa-play"></i>
                        </button>
                        <div class="overflow-hidden">
                            <div class="text-[11px] font-bold text-amber-300 truncate">🔥 Sôi Động</div>
                            <div id="energetic-status" class="text-[9px] text-slate-400 truncate">Bấm nghe</div>
                        </div>
                    </div>

                    <!-- Ô 2: NHẠC NHẸ NHÀNG -->
                    <div class="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1.5 rounded-xl flex-1 min-w-[150px]">
                        <button onclick="playMusicType('gentle')" class="w-7 h-7 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl flex items-center justify-center text-xs transition cursor-pointer font-black shrink-0">
                            <i class="fa-solid fa-play"></i>
                        </button>
                        <div class="overflow-hidden">
                            <div class="text-[11px] font-bold text-emerald-300 truncate">🌿 Nhẹ Nhàng</div>
                            <div id="gentle-status" class="text-[9px] text-slate-400 truncate">Bấm nghe</div>
                        </div>
                    </div>

                    <!-- Ô 3: ÂM THANH XANH -->
                    <div class="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1.5 rounded-xl flex-1 min-w-[150px]">
                        <button onclick="toggleRainSound()" id="rain-btn" class="w-7 h-7 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl flex items-center justify-center text-xs transition cursor-pointer font-black shrink-0">
                            <i class="fa-solid fa-cloud-rain"></i>
                        </button>
                        <div class="overflow-hidden">
                            <div class="text-[11px] font-bold text-cyan-300 truncate">🍃 Âm Thanh Xanh</div>
                            <div id="rain-status" class="text-[9px] text-slate-400 truncate">Tiếng mưa & thiên nhiên</div>
                        </div>
                    </div>

                    <!-- Nút bài tiếp theo -->
                    <div class="flex items-center gap-1.5 w-full justify-end mt-1">
                        <button onclick="nextMoodMusic()" class="px-2.5 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-[10px] font-semibold rounded-xl transition cursor-pointer">
                            ⏭️ Bài Khác
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <audio id="bg-audio" loop preload="auto"></audio>
        <audio id="rain-audio" loop src="https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3" preload="none"></audio>

        <div id="mood-custom-modal" class="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[9999] flex items-center justify-center p-3 sm:p-5 hidden">
            <div class="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl max-w-4xl w-full p-4 sm:p-6 relative shadow-2xl text-center space-y-3">
                <button onclick="closeMoodModal()" class="absolute top-3 right-3 text-slate-400 hover:text-white text-base font-bold cursor-pointer">✕</button>
                <div id="mood-modal-body"></div>
            </div>
        </div>
    `;
};

window.handleMoodSelect = function(moodKey) {
    currentMood = moodKey;
    const moodConfig = MOOD_MESSAGES[moodKey];
    if (!moodConfig) return;
    const welcomePrompt = document.getElementById('welcome-prompt');
    if (welcomePrompt) welcomePrompt.classList.add('hidden');
    window.launchMoodParticles(moodKey);

    const randomQuote = getRandomQuote(moodKey);
    const boxElem = document.getElementById('mood-talk-box');
    const titleElem = document.getElementById('talk-title');
    const talkElem = document.getElementById('mood-talk-text');
    const avatarElem = document.getElementById('talk-avatar');

    if (boxElem) boxElem.className = "my-5 p-5 bg-slate-950 rounded-2xl border-2 mood-glow-border relative flex items-start gap-3.5 text-left shadow-2xl transition-all duration-300";
    if (titleElem) {
        titleElem.innerText = moodConfig.title;
        titleElem.className = `text-xs sm:text-sm font-black tracking-wide ${moodConfig.glowClass}`;
    }
    if (talkElem) {
        talkElem.innerText = `"${randomQuote}"`;
        talkElem.classList.remove('hidden');
        talkElem.className = "text-xs sm:text-sm text-slate-100 leading-relaxed font-normal tracking-wide select-text mt-1";
    }
    if (avatarElem) avatarElem.innerText = moodConfig.avatar;
};

// KÍCH HOẠCH GAME
window.launchCurrentMoodGame = function() {
    window.stopMoodParticles();

    gameScore = 0;
    gameLevel = 1;
    if (currentMood === 'happy') playSum2248Game();
    else if (currentMood === 'chill') playShadowMatchGame();
    else if (currentMood === 'stressed') playSpeedParticleGame();
    else playCatchWordsGame();
};

// ==========================================
// GAME 1: 🔥 FULL NĂNG LƯỢNG -> GAME NỐI SỐ 2248
// ==========================================
let board2248 = [];
const BOARD_SIZE = 5;
let isConnecting = false;
let connectedPath = [];

function playSum2248Game() {
    const modal = document.getElementById('mood-custom-modal');
    const body = document.getElementById('mood-modal-body');
    if (!modal || !body) return;

    gameScore = 0;
    gameLevel = 1;
    init2248Board();

    body.innerHTML = `
        <div class="space-y-3 select-none">
            <div class="flex justify-between items-center border-b border-slate-800 pb-2">
                <span class="text-xs sm:text-sm font-black text-amber-400 tracking-wide">🔥 2248 SUM MATCH: NỐI SỐ BỨT PHÁ</span>
                <div class="flex items-center gap-3">
                    <span class="text-xs font-bold text-cyan-400">LEVEL: <b id="g2248-lvl" class="text-sm text-cyan-300">1</b></span>
                    <span class="text-xs font-bold text-emerald-400">ĐIỂM: <b id="g2248-score" class="text-sm text-emerald-300">0</b></span>
                </div>
            </div>

            <p class="text-xs text-slate-300 text-left">💡 Kéo chuột/ngón tay nối các ô <b>bằng nhau</b> hoặc <b>gấp đôi nhau</b> (VD: 2➔2➔4➔8) theo các hướng để hợp nhất thành số lớn hơn!</p>

            <div id="grid-2248-container" 
                 onpointerup="end2248Connect()"
                 class="grid grid-cols-5 gap-2 p-3 bg-slate-950 rounded-2xl border-2 border-amber-500/50 relative shadow-2xl max-w-[360px] mx-auto touch-none">
            </div>

            <button onclick="playSum2248Game()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl shadow-md transition cursor-pointer">
                🔄 Xáo Bàn Chơi Mới
            </button>
        </div>
    `;

    modal.classList.remove('hidden');
    render2248Board();
}

function init2248Board() {
    const baseValues = [2, 4, 8, 16];
    board2248 = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
        let row = [];
        for (let c = 0; c < BOARD_SIZE; c++) {
            row.push(baseValues[Math.floor(Math.random() * baseValues.length)]);
        }
        board2248.push(row);
    }
}

function getTileColor(val) {
    if (val === 2) return 'bg-amber-500/20 border-amber-500/50 text-amber-300';
    if (val === 4) return 'bg-orange-500/30 border-orange-500/60 text-orange-300';
    if (val === 8) return 'bg-rose-500/30 border-rose-500/60 text-rose-300';
    if (val === 16) return 'bg-pink-500/30 border-pink-500/60 text-pink-300';
    if (val === 32) return 'bg-purple-500/40 border-purple-500 text-purple-200';
    if (val === 64) return 'bg-indigo-500/40 border-indigo-500 text-indigo-200';
    if (val === 128) return 'bg-cyan-500/50 border-cyan-400 text-cyan-200 font-black shadow-[0_0_12px_rgba(56,189,248,0.5)]';
    if (val >= 256) return 'bg-emerald-500/60 border-emerald-400 text-emerald-100 font-black shadow-[0_0_18px_rgba(52,211,153,0.8)] animate-pulse';
    return 'bg-slate-800 text-white';
}

function render2248Board() {
    const container = document.getElementById('grid-2248-container');
    if (!container) return;

    let html = '';
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const val = board2248[r][c];
            const isSelected = connectedPath.some(p => p.r === r && p.c === c);
            const selectClass = isSelected ? 'scale-110 border-2 border-cyan-400 ring-2 ring-cyan-400/50 bg-cyan-900/80 z-10' : '';

            html += `
                <div onpointerdown="start2248Connect(${r}, ${c}, event)"
                     onpointerenter="move2248Connect(${r}, ${c})"
                     class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border flex items-center justify-center font-black text-sm sm:text-base cursor-pointer transition-all duration-150 select-none ${getTileColor(val)} ${selectClass}">
                    ${val}
                </div>
            `;
        }
    }
    container.innerHTML = html;
}

window.start2248Connect = function(r, c, e) {
    isConnecting = true;
    connectedPath = [{ r, c, val: board2248[r][c] }];
    render2248Board();
};

window.move2248Connect = function(r, c) {
    if (!isConnecting || connectedPath.length === 0) return;

    const last = connectedPath[connectedPath.length - 1];
    const dr = Math.abs(r - last.r);
    const dc = Math.abs(c - last.c);
    if (dr > 1 || dc > 1 || (dr === 0 && dc === 0)) return;

    if (connectedPath.length >= 2) {
        const prev = connectedPath[connectedPath.length - 2];
        if (prev.r === r && prev.c === c) {
            connectedPath.pop();
            render2248Board();
            return;
        }
    }

    if (connectedPath.some(p => p.r === r && p.c === c)) return;

    const currentVal = board2248[r][c];

    if (connectedPath.length === 1) {
        if (currentVal === last.val) {
            connectedPath.push({ r, c, val: currentVal });
            render2248Board();
        }
    } else {
        if (currentVal === last.val || currentVal === last.val * 2) {
            connectedPath.push({ r, c, val: currentVal });
            render2248Board();
        }
    }
};

window.end2248Connect = function() {
    if (!isConnecting) return;
    isConnecting = false;

    if (connectedPath.length >= 2) {
        let sumVal = 0;
        connectedPath.forEach(p => sumVal += p.val);

        let nextVal = 2;
        while (nextVal < sumVal) nextVal *= 2;

        const lastTile = connectedPath[connectedPath.length - 1];

        gameScore += nextVal;
        const scoreElem = document.getElementById('g2248-score');
        const lvlElem = document.getElementById('g2248-lvl');
        if (scoreElem) scoreElem.innerText = gameScore;

        if (gameScore >= gameLevel * 100) {
            gameLevel++;
            if (lvlElem) lvlElem.innerText = gameLevel;
        }

        board2248[lastTile.r][lastTile.c] = nextVal;

        for (let i = 0; i < connectedPath.length - 1; i++) {
            const p = connectedPath[i];
            board2248[p.r][p.c] = null;
        }

        for (let c = 0; c < BOARD_SIZE; c++) {
            let emptyRows = [];
            for (let r = BOARD_SIZE - 1; r >= 0; r--) {
                if (board2248[r][c] === null) {
                    emptyRows.push(r);
                } else if (emptyRows.length > 0) {
                    const targetR = emptyRows.shift();
                    board2248[targetR][c] = board2248[r][c];
                    board2248[r][c] = null;
                    emptyRows.push(r);
                }
            }
            const baseValues = [2, 4, 8, 16];
            for (let r = 0; r < BOARD_SIZE; r++) {
                if (board2248[r][c] === null) {
                    board2248[r][c] = baseValues[Math.floor(Math.random() * baseValues.length)];
                }
            }
        }
    }

    connectedPath = [];
    render2248Board();
};

// ==========================================
// GAME 2: 🌿 Ô THƯ THÁI -> GAME HÌNH VÀ BÓNG
// ==========================================
let currentAngle = 0;
let isMovingRight = true;
let targetAngle = 0;
const ITEM_ICONS = ['🚀', '🔥', '⭐', '⚡', '🎯', '👑'];
let currentIcon = '🚀';

function playShadowMatchGame() {
    const modal = document.getElementById('mood-custom-modal');
    const body = document.getElementById('mood-modal-body');
    if (!modal || !body) return;

    gameScore = 0;
    gameLevel = 1;
    currentAngle = -60;
    targetAngle = 0;
    currentIcon = ITEM_ICONS[Math.floor(Math.random() * ITEM_ICONS.length)];

    body.innerHTML = `
        <div class="space-y-4">
            <div class="flex justify-between items-center border-b border-slate-800 pb-2">
                <span class="text-xs sm:text-sm font-black text-emerald-400">🌿 THƯ THÁI: GAME HÌNH VÀ BÓNG</span>
                <span class="text-xs sm:text-sm font-bold text-cyan-400">LEVEL: <b id="sm-lvl">1</b></span>
                <span class="text-xs sm:text-sm font-bold text-emerald-400">ĐIỂM: <b id="sm-score">0</b></span>
            </div>

            <p class="text-xs text-slate-300">Canh thời điểm hình xoay trùng khớp hoàn toàn lên BÓNG ĐEN rồi bấm DỪNG!</p>

            <div class="relative w-full h-[380px] bg-slate-950 rounded-3xl border-2 border-emerald-500/50 overflow-hidden flex items-center justify-center select-none shadow-inner">
                <div class="absolute text-8xl opacity-20 filter grayscale contrast-200" style="transform: rotate(0deg);">
                    ${currentIcon}
                </div>
                <div id="moving-shape" class="absolute text-8xl filter drop-shadow-[0_0_20px_rgba(52,211,153,0.9)] transition-none">
                    ${currentIcon}
                </div>
                <div id="match-feedback" class="absolute top-6 text-sm font-black uppercase tracking-widest hidden"></div>
            </div>

            <button onclick="stopShadowMatch()" class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 font-black text-slate-950 rounded-2xl text-xs sm:text-sm shadow-lg transition transform active:scale-95 cursor-pointer">
                🎯 DỪNG NGAY KHỚP BÓNG
            </button>
        </div>
    `;

    modal.classList.remove('hidden');
    startShadowMatchLoop();
}

function startShadowMatchLoop() {
    clearTimeout(gameTimer);

    const shape = document.getElementById('moving-shape');
    if (!shape) return;

    const speed = 2.5 + gameLevel * 1.5;

    if (isMovingRight) {
        currentAngle += speed;
        if (currentAngle >= 70) isMovingRight = false;
    } else {
        currentAngle -= speed;
        if (currentAngle <= -70) isMovingRight = true;
    }

    shape.style.transform = `rotate(${currentAngle}deg)`;
    gameTimer = setTimeout(startShadowMatchLoop, 20);
}

window.stopShadowMatch = function() {
    clearTimeout(gameTimer);

    const feedback = document.getElementById('match-feedback');
    if (!feedback) return;

    const diff = Math.abs(currentAngle - targetAngle);

    if (diff <= 8) {
        gameScore += 20;
        feedback.innerText = "✨ HOÀN HẢO! +20 ĐIỂM";
        feedback.className = "absolute top-6 text-sm font-black uppercase tracking-widest text-emerald-400 animate-bounce";
    } else if (diff <= 20) {
        gameScore += 10;
        feedback.innerText = "👍 KHÁ TỐT! +10 ĐIỂM";
        feedback.className = "absolute top-6 text-sm font-black uppercase tracking-widest text-amber-400";
    } else {
        feedback.innerText = "❌ LỆCH BÓNG RỒI!";
        feedback.className = "absolute top-6 text-sm font-black uppercase tracking-widest text-rose-500";
    }

    feedback.classList.remove('hidden');

    if (gameScore >= gameLevel * 30) {
        gameLevel++;
    }

    const scoreElem = document.getElementById('sm-score');
    const lvlElem = document.getElementById('sm-lvl');
    if (scoreElem) scoreElem.innerText = gameScore;
    if (lvlElem) lvlElem.innerText = gameLevel;

    setTimeout(() => {
        if (document.getElementById('moving-shape')) {
            feedback.classList.add('hidden');
            currentIcon = ITEM_ICONS[Math.floor(Math.random() * ITEM_ICONS.length)];
            const modalBody = document.getElementById('mood-modal-body');
            if (modalBody) {
                const shapes = modalBody.querySelectorAll('.text-8xl');
                shapes.forEach(s => s.innerText = currentIcon);
            }
            currentAngle = -60;
            isMovingRight = true;
            startShadowMatchLoop();
        }
    }, 1000);
};

// ==========================================
// GAME 3: ☕ Ô HƠI ÁP LỰC -> PHẢN XẠ HẠT NĂNG LƯỢNG
// ==========================================
function playSpeedParticleGame() {
    const modal = document.getElementById('mood-custom-modal');
    const body = document.getElementById('mood-modal-body');
    if (!modal || !body) return;

    gameScore = 0;
    gameLevel = 1;

    body.innerHTML = `
        <div class="space-y-4">
            <div class="flex justify-between items-center border-b border-slate-800 pb-2">
                <span class="text-xs sm:text-sm font-black text-rose-400">☕ HƠI ÁP LỰC: PHẢN XẠ HẠT NĂNG LƯỢNG</span>
                <span class="text-xs sm:text-sm font-bold text-cyan-400">LEVEL: <b id="p-lvl">1</b></span>
                <span class="text-xs sm:text-sm font-bold text-emerald-400">ĐIỂM: <b id="p-score">0</b></span>
            </div>
            <p class="text-xs text-slate-300">💡 Chạm/Bấm nhanh vào hạt năng lượng ⚡ trước khi nó biến mất để xoa dịu căng thẳng nhé!</p>
            <div id="particle-canvas" class="relative w-full h-[380px] bg-slate-950 rounded-2xl border-2 border-rose-500/50 overflow-hidden shadow-2xl"></div>
        </div>
    `;

    modal.classList.remove('hidden');
    spawnParticleTarget();
}

function spawnParticleTarget() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    canvas.innerHTML = '';
    const btn = document.createElement('button');
    const size = Math.max(40, 75 - gameLevel * 6); 
    const posX = Math.floor(Math.random() * (canvas.clientWidth - size));
    const posY = Math.floor(Math.random() * (canvas.clientHeight - size));

    btn.className = "absolute rounded-full bg-gradient-to-r from-amber-400 to-rose-500 flex items-center justify-center text-xl font-bold text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.8)] cursor-pointer transition-all active:scale-75 animate-bounce";
    btn.style.width = `${size}px`;
    btn.style.height = `${size}px`;
    btn.style.left = `${posX}px`;
    btn.style.top = `${posY}px`;
    btn.innerText = "⚡";

    btn.onclick = () => {
        gameScore += 10;
        const scoreElem = document.getElementById('p-score');
        const lvlElem = document.getElementById('p-lvl');
        if (scoreElem) scoreElem.innerText = gameScore;

        if (gameScore >= gameLevel * 30) {
            gameLevel++;
            if (lvlElem) lvlElem.innerText = gameLevel;
        }
        spawnParticleTarget();
    };

    canvas.appendChild(btn);

    clearTimeout(gameTimer);
    gameTimer = setTimeout(spawnParticleTarget, Math.max(450, 1300 - gameLevel * 120));
}

// ==========================================
// GAME 4: 😴 Ô CẦN NẠP PIN -> HỨNG TỪ NĂNG LƯỢNG TÍCH CỰC
// ==========================================
let wordCatcherX = 300;
let fallingWords = [];
const POSITIVE_WORDS = ["🌸 Yêu Thương", "🌿 Tử Tế", "✨ Văn Minh", "🍃 Lắng Nghe", "🕊️ Bao Dung", "💖 Tự Tin"];
const NEGATIVE_WORDS = ["💥 Giận Dữ", "🥀 Mệt Mỏi", "⚡ Tị Nạnh"];

function playCatchWordsGame() {
    const modal = document.getElementById('mood-custom-modal');
    const body = document.getElementById('mood-modal-body');
    if (!modal || !body) return;

    gameScore = 0;
    gameLevel = 1;

    body.innerHTML = `
        <div class="space-y-2.5">
            <div class="flex justify-between items-center border-b border-slate-800 pb-2">
                <span class="text-xs sm:text-sm font-black text-indigo-300 tracking-wide">😴 CẦN NẠP PIN: HỨNG NĂNG LƯỢNG TÍCH CỰC</span>
                <div class="flex items-center gap-3">
                    <span class="text-xs font-bold text-cyan-400">LEVEL: <b id="cw-lvl" class="text-sm text-cyan-300">1</b></span>
                    <span class="text-xs font-bold text-emerald-400">ĐIỂM: <b id="cw-score" class="text-sm text-emerald-300">0</b></span>
                </div>
            </div>

            <p class="text-xs text-slate-300 text-left">💡 Di chuyển <b>Trạm Sạc 🔋</b> hứng <b class="text-emerald-400 font-bold">Từ Tích Cực (+10đ)</b>! 🚫 <b class="text-rose-400 font-bold">NÉ TỪ TIÊU CỰC (NỔ = GAME OVER)</b>!</p>

            <div id="word-catcher-canvas" onmousemove="moveWordCatcher(event)" ontouchmove="moveWordCatcherTouch(event)" class="relative w-full h-[380px] bg-slate-950 rounded-2xl border-2 border-indigo-500/50 overflow-hidden cursor-crosshair select-none shadow-2xl">
                
                <div id="words-container" class="absolute inset-0 pointer-events-none"></div>

                <div id="cw-game-over" class="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center gap-3 hidden z-20">
                    <div class="text-4xl">💥💥💥</div>
                    <div class="text-base font-black text-rose-500 uppercase tracking-widest animate-bounce">CHẠM TỪ TIÊU CỰC! GAME OVER!</div>
                    <p class="text-xs text-slate-300">Tổng điểm đạt được: <b id="final-cw-score" class="text-indigo-300 font-bold text-sm">0</b></p>
                    <button onclick="playCatchWordsGame()" class="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 font-extrabold text-slate-950 text-xs rounded-xl shadow-lg hover:scale-105 transition cursor-pointer">
                        🔄 CHƠI LẠI NGAY
                    </button>
                </div>

                <div id="word-catcher" class="absolute w-32 h-10 bg-slate-900 border-2 border-indigo-400 rounded-xl flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(129,140,248,0.7)] transition-all duration-75 z-10" style="left: ${wordCatcherX}px; bottom: 12px;">
                    <span class="text-xl">🔋</span>
                    <span class="text-[10px] font-black text-indigo-300 uppercase tracking-tight">TRẠM SẠC</span>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    initFallingWords();
    startCatchWordsLoop();
}

function initFallingWords() {
    fallingWords = [];
    const count = Math.min(4, 1 + Math.floor(gameLevel / 2));
    const canvas = document.getElementById('word-catcher-canvas');
    const width = canvas ? canvas.clientWidth : 700;

    for (let i = 0; i < count; i++) {
        const isNegative = Math.random() < 0.35;
        const wordText = isNegative 
            ? NEGATIVE_WORDS[Math.floor(Math.random() * NEGATIVE_WORDS.length)]
            : POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)];

        fallingWords.push({
            id: i,
            text: wordText,
            isNegative: isNegative,
            x: Math.floor(Math.random() * (width - 140)),
            y: -Math.floor(Math.random() * 200) - 30,
            speed: 3 + Math.random() * 2 + gameLevel * 1.2
        });
    }
}

window.moveWordCatcher = function(e) {
    const canvas = document.getElementById('word-catcher-canvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    wordCatcherX = e.clientX - rect.left - 64;
    wordCatcherX = Math.max(0, Math.min(canvas.clientWidth - 128, wordCatcherX));
    const catcher = document.getElementById('word-catcher');
    if (catcher) catcher.style.left = `${wordCatcherX}px`;
};

window.moveWordCatcherTouch = function(e) {
    const canvas = document.getElementById('word-catcher-canvas');
    if (!canvas || !e.touches[0]) return;
    const rect = canvas.getBoundingClientRect();
    wordCatcherX = e.touches[0].clientX - rect.left - 64;
    wordCatcherX = Math.max(0, Math.min(canvas.clientWidth - 128, wordCatcherX));
    const catcher = document.getElementById('word-catcher');
    if (catcher) catcher.style.left = `${wordCatcherX}px`;
};

function startCatchWordsLoop() {
    clearTimeout(gameTimer);

    const container = document.getElementById('words-container');
    const canvas = document.getElementById('word-catcher-canvas');
    const gameOverScreen = document.getElementById('cw-game-over');

    if (!container || !canvas || !gameOverScreen) return;

    let htmlStr = '';

    for (let i = 0; i < fallingWords.length; i++) {
        let item = fallingWords[i];
        item.y += item.speed;

        if (item.y >= canvas.clientHeight - 50 && item.y <= canvas.clientHeight - 10) {
            if (item.x + 100 >= wordCatcherX && item.x <= wordCatcherX + 128) {
                
                if (item.isNegative) {
                    document.getElementById('final-cw-score').innerText = gameScore;
                    gameOverScreen.classList.remove('hidden');
                    return;
                }

                gameScore += 10;
                const catcher = document.getElementById('word-catcher');
                if (catcher) {
                    catcher.classList.add('notebook-hit-effect');
                    setTimeout(() => catcher.classList.remove('notebook-hit-effect'), 300);
                }

                const scoreElem = document.getElementById('cw-score');
                const lvlElem = document.getElementById('cw-lvl');
                if (scoreElem) scoreElem.innerText = gameScore;

                if (gameScore >= gameLevel * 30) {
                    gameLevel++;
                    if (lvlElem) lvlElem.innerText = gameLevel;
                    initFallingWords();
                    break;
                }

                item.y = -40;
                item.isNegative = Math.random() < 0.35;
                item.text = item.isNegative 
                    ? NEGATIVE_WORDS[Math.floor(Math.random() * NEGATIVE_WORDS.length)]
                    : POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)];
                item.x = Math.floor(Math.random() * (canvas.clientWidth - 140));
            }
        }

        if (item.y >= canvas.clientHeight) {
            item.y = -40;
            item.isNegative = Math.random() < 0.35;
            item.text = item.isNegative 
                ? NEGATIVE_WORDS[Math.floor(Math.random() * NEGATIVE_WORDS.length)]
                : POSITIVE_WORDS[Math.floor(Math.random() * POSITIVE_WORDS.length)];
            item.x = Math.floor(Math.random() * (canvas.clientWidth - 140));
        }

        let styleClass = "text-sm font-black text-emerald-200 bg-slate-900 border-2 border-emerald-400 rounded-2xl px-4 py-1.5 shadow-[0_0_15px_rgba(52,211,153,0.8)]";
        if (item.isNegative) {
            styleClass = "text-sm font-black text-rose-200 bg-slate-900 border-2 border-rose-500 rounded-2xl px-4 py-1.5 shadow-[0_0_15px_rgba(244,63,94,0.8)]";
        }

        htmlStr += `<div class="absolute ${styleClass}" style="left: ${item.x}px; top: ${item.y}px;">${item.text}</div>`;
    }

    container.innerHTML = htmlStr;
    gameTimer = setTimeout(startCatchWordsLoop, 22);
}

// BẬT / TẮT TIỆN ÍCH MODAL & ÂM NHẠC
window.closeMoodModal = function() {
    const modal = document.getElementById('mood-custom-modal');
    if (modal) modal.classList.add('hidden');
    if (gameTimer) clearTimeout(gameTimer);
};

window.toggleMoodMusic = function() {
    const audio = document.getElementById('bg-audio');
    if (!audio) return;
    if (audio.paused) {
        audio.play().then(() => updateMusicUI(true)).catch(() => {});
    } else {
        audio.pause();
        updateMusicUI(false);
    }
};

window.toggleRainSound = function() {
    const rainAudio = document.getElementById('rain-audio');
    const rainBtn = document.getElementById('rain-btn');
    if (!rainAudio) return;
    if (isRainPlaying) {
        rainAudio.pause();
        isRainPlaying = false;
        if (rainBtn) rainBtn.className = "px-2 py-1 bg-slate-900 border border-slate-700 text-slate-400 text-[10px] font-semibold rounded-xl cursor-pointer";
    } else {
        rainAudio.play().then(() => {
            isRainPlaying = true;
            if (rainBtn) rainBtn.className = "px-2 py-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-semibold rounded-xl cursor-pointer shadow-md";
        }).catch(() => {});
    }
};

function updateMusicUI(isPlaying) {
    const playBtn = document.getElementById('play-btn');
    const statusTxt = document.getElementById('music-status');
    if (isPlaying) {
        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        if (statusTxt) {
            statusTxt.innerText = "Đang phát...";
            statusTxt.className = "text-[9px] text-emerald-400 font-bold animate-pulse";
        }
    } else {
        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        if (statusTxt) {
            statusTxt.innerText = "Đang dừng";
            statusTxt.className = "text-[9px] text-slate-400";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.renderMoodStation();
});

// Ánh xạ hàm selectMood về handleMoodSelect để tương thích
window.selectMood = function(moodKey) {
    if (typeof window.handleMoodSelect === 'function') {
        window.handleMoodSelect(moodKey);
    }
};

// ĐIỀU KHIỂN ÂM THANH XANH & NHẠC NỀN
window.toggleRainSound = function() {
    const rainAudio = document.getElementById('rain-audio');
    const rainBtn = document.getElementById('rain-btn');
    if (!rainAudio) return;
    if (isRainPlaying) {
        rainAudio.pause();
        isRainPlaying = false;
        if (rainBtn) rainBtn.className = "w-7 h-7 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl flex items-center justify-center text-xs transition cursor-pointer font-black shrink-0";
    } else {
        rainAudio.play().then(() => {
            isRainPlaying = true;
            if (rainBtn) rainBtn.className = "w-7 h-7 bg-cyan-400 text-slate-950 rounded-xl flex items-center justify-center text-xs transition cursor-pointer font-black shrink-0 shadow-[0_0_10px_rgba(56,189,248,0.8)] animate-pulse";
        }).catch(() => {});
    }
};

window.playMusicType = function(type) {
    currentPlaylistType = type;
    currentSongIndex = 0;
    const list = MUSIC_PLAYLISTS[currentPlaylistType];
    if (!list || list.length === 0) return;
    const song = list[currentSongIndex];
    const audio = document.getElementById('bg-audio');
    if (!audio || !song) return;
    audio.src = song.src;
    audio.load();
    audio.play().then(() => {
        if (type === 'energetic') {
            const status = document.getElementById('energetic-status');
            if (status) status.innerText = "▶ " + song.title;
        } else if (type === 'gentle') {
            const status = document.getElementById('gentle-status');
            if (status) status.innerText = "▶ " + song.title;
        }
    }).catch((error) => { console.log("Lỗi phát nhạc:", error); });
};

window.nextMoodMusic = function() {
    const list = MUSIC_PLAYLISTS[currentPlaylistType];
    if (!list || list.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % list.length;
    const song = list[currentSongIndex];
    const audio = document.getElementById('bg-audio');
    if (!audio || !song) return;
    audio.src = song.src;
    audio.load();
    audio.play().then(() => {
        if (currentPlaylistType === 'energetic') {
            const status = document.getElementById('energetic-status');
            if (status) status.innerText = "▶ " + song.title;
        } else if (currentPlaylistType === 'gentle') {
            const status = document.getElementById('gentle-status');
            if (status) status.innerText = "▶ " + song.title;
        }
    });
};

document.addEventListener("DOMContentLoaded", () => {
    window.renderMoodStation();
});