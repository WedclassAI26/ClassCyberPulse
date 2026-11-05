// ==========================================
// DANH SÁCH QUẢN TRỊ VIÊN (ADMIN CONFIG)
// Dành cho Chủ trang web (Developer/Owner)
// ==========================================

const ADMIN_CONFIG = {
    // 1. Danh sách Email được trao quyền Admin cao nhất
    adminEmails: [
        "hongkimhan26@gmail.com",       // 👈 Email của bạn (Chủ Web)
        "thaychunhiem@school.edu.vn",  // 👈 Email Giáo viên/BGH
        "loptruong11a1@gmail.com"      // 👈 Email Ban cán sự lớp
    ],

    // 2. Danh sách Mã Số Học Sinh / Username Admin (Nếu dùng login không bằng email)
    adminUsernames: [
        "admin",
        "ban_co_do_11a1"
    ]
};

// Hàm kiểm tra quyền Admin dùng chung cho TOÀN BỘ TRANG WEB

window.checkIsAdmin = function() {
    const currentUser = firebase.auth().currentUser;

    return Boolean(
        currentUser &&
        currentUser.uid === "Y3aOnWlJaYdCnVwhtOagPj1016B3"
    );
};
