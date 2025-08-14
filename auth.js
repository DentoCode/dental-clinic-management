// تسجيل الدخول
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    // مصادقة وهمية
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    
    // الانتقال إلى لوحة التحكم
    window.location.href = 'dashboard.html';
});

// تسجيل الخروج
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
});