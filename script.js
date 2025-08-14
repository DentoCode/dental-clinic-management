// هذا الملف سيكون للنواة الأساسية للتطبيق

// تهيئة التطبيق
function initApp() {
    // التحقق من تسجيل الدخول
    checkLogin();
    
    // تهيئة الوحدات المشتركة
    initializeApp();
    
    // تهيئة الوحدات الأخرى
    if (document.getElementById('patientsTable')) {
        initPatients();
    }
    
    // يمكن إضافة تهيئة للوحدات الأخرى هنا
}

// بدء التطبيق
document.addEventListener('DOMContentLoaded', initApp);