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
    const savedUser = localStorage.getItem("cyberUser");
    if (!savedUser) return false;
    
    try {
        const user = JSON.parse(savedUser);
        
        // Kiểm tra Email
        if (user.email && ADMIN_CONFIG.adminEmails.map(e => e.toLowerCase()).includes(user.email.toLowerCase())) {
            return true;
        }
        
        // Kiểm tra Tên tài khoản / Username
        if (user.username && ADMIN_CONFIG.adminUsernames.map(u => u.toLowerCase()).includes(user.username.toLowerCase())) {
            return true;
        }

        // Kiểm tra cờ role
        return user.role === 'admin' || user.isAdmin === true;
    } catch (e) {
        return false;
    }
};