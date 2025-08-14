// تهيئة التطبيق
function initializeApp() {
    // تحميل البيانات من localStorage
    loadData();
    initSidebarToggle();
    initModals();
    if (document.getElementById('patientProfile')) {
        initPatientProfile();
    }

    // تحديث التاريخ والوقت
    updateDateTime();
    setInterval(updateDateTime, 60000);
    
    // إعداد اسم المستخدم
    const username = localStorage.getItem('username') || 'دكتور';
    document.querySelector('.user-name').textContent = username;
    
    // تحميل بيانات لوحة التحكم
    loadDashboardData();
}

// تحميل البيانات من localStorage
function loadData() {
    // إذا لم تكن البيانات موجودة، نقوم بتهيئتها
    if (!localStorage.getItem('patients')) {
        localStorage.setItem('patients', JSON.stringify([
            {
                id: 1,
                name: 'محمد أحمد',
                age: 35,
                phone: '0123456789',
                email: 'mohamed@example.com',
                address: 'القاهرة، مصر',
                registrationDate: new Date().toISOString()
            },
            {
                id: 2,
                name: 'سارة محمود',
                age: 28,
                phone: '0111222333',
                email: 'sara@example.com',
                address: 'الإسكندرية، مصر',
                registrationDate: new Date().toISOString()
            }
        ]));
    }
    
    if (!localStorage.getItem('treatments')) {
        localStorage.setItem('treatments', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('payments')) {
        localStorage.setItem('payments', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('appointments')) {
        localStorage.setItem('appointments', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('settings')) {
        localStorage.setItem('settings', JSON.stringify({
            clinicName: 'عيادة الأسنان',
            doctorName: 'د. أحمد محمد',
            phone: '0123456789',
            address: 'شارع النخيل، القاهرة',
            currency: 'جنيه'
        }));
    }
}

// تحديث التاريخ والوقت
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('ar-EG', options);
}

// تحميل بيانات لوحة التحكم
function loadDashboardData() {
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const payments = JSON.parse(localStorage.getItem('payments')) || [];
    
    // تحديث البطاقات
    document.getElementById('patientsCount').textContent = patients.length;
    
    const todayAppointments = appointments.filter(app => {
        const appDate = new Date(app.date);
        const today = new Date();
        return appDate.toDateString() === today.toDateString();
    });
    document.getElementById('appointmentsCount').textContent = todayAppointments.length;
    
    const todayPayments = payments.filter(pay => {
        const payDate = new Date(pay.date);
        const today = new Date();
        return payDate.toDateString() === today.toDateString();
    });
    const totalAmount = todayPayments.reduce((sum, pay) => sum + pay.amount, 0);
    document.getElementById('paymentsAmount').textContent = totalAmount;
    
    const treatments = JSON.parse(localStorage.getItem('treatments')) || [];
    document.getElementById('treatmentsCount').textContent = treatments.length;
    
    // تحديث المواعيد القادمة
    loadUpcomingAppointments();
    
    // تحديث أحدث المدفوعات
    loadRecentPayments();
}

// تحميل المواعيد القادمة
function loadUpcomingAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const upcoming = appointments
        .filter(app => new Date(app.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    
    const container = document.getElementById('upcomingAppointments');
    container.innerHTML = '';
    
    if (upcoming.length === 0) {
        container.innerHTML = '<div class="appointment-item"><span>لا توجد مواعيد قادمة</span></div>';
        return;
    }
    
    upcoming.forEach(app => {
        const appDate = new Date(app.date);
        const item = document.createElement('div');
        item.className = 'appointment-item';
        item.innerHTML = `
            <span>${app.patientName}</span>
            <span>${appDate.toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}</span>
            <span>${appDate.toLocaleDateString('ar-EG')}</span>
        `;
        container.appendChild(item);
    });
}

// تحميل أحدث المدفوعات
function loadRecentPayments() {
    const payments = JSON.parse(localStorage.getItem('payments')) || [];
    const recent = payments
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    const container = document.getElementById('recentPayments');
    container.innerHTML = '';
    
    if (recent.length === 0) {
        container.innerHTML = '<div class="payment-item"><span>لا توجد مدفوعات حديثة</span></div>';
        return;
    }
    
    recent.forEach(pay => {
        const payDate = new Date(pay.date);
        const item = document.createElement('div');
        item.className = 'payment-item';
        item.innerHTML = `
            <span>${pay.patientName}</span>
            <span>${pay.amount} جنيه</span>
            <span>${payDate.toLocaleDateString('ar-EG')}</span>
        `;
        container.appendChild(item);
    });
}

// التحقق من تسجيل الدخول
function checkLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'index.html';
    }
}

// تبديل التبويبات
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const tabId = this.getAttribute('data-tab');
        
        // إزالة النشاط من جميع التبويبات
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        
        // إضافة النشاط للتبويب المحدد
        this.classList.add('active');
        document.getElementById(tabId).classList.add('active');
        
        // تحديث عنوان الصفحة
        document.querySelector('.page-title span').textContent = this.querySelector('.nav-text').textContent;
        document.querySelector('.page-title i').className = this.querySelector('i').className;
        
        // تحميل البيانات الخاصة بالتبويب إذا لزم الأمر
        if (tabId === 'patients') {
            loadPatients();
        }
        // يمكنك إضافة المزيد من الشروط للتبويبات الأخرى
    });
});

// عند التحميل: التأكد من أن فقط التبويب النشط هو الظاهر
document.addEventListener('DOMContentLoaded', function() {
    // إخفاء جميع التبويبات
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // إظهار التبويب النشط فقط
    const activeTab = document.querySelector('.nav-item.active');
    if (activeTab) {
        const tabId = activeTab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    }
});


// إضافة دالة لتبديل الشريط الجانبي للأجهزة الصغيرة
function initSidebarToggle() {
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(menuToggle);
    
    menuToggle.addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });
}

// تعديل دالة تهيئة التطبيق
function initializeApp() {
    // تحميل البيانات من localStorage
    loadData();
    
    // تحديث التاريخ والوقت
    updateDateTime();
    setInterval(updateDateTime, 60000);
    
    // إعداد اسم المستخدم
    const username = localStorage.getItem('username') || 'دكتور';
    document.querySelector('.user-name').textContent = username;
    
    // تحميل بيانات لوحة التحكم
    loadDashboardData();
    
    // تهيئة تبديل الشريط الجانبي
    initSidebarToggle();

        // تهيئة التنبيهات
    const style = document.createElement('style');
    style.textContent = `
        .alert {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            box-shadow: var(--shadow-hover);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .alert.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        
        .alert-success {
            background-color: var(--success);
        }
        
        .alert-error {
            background-color: var(--danger);
        }
    `;
    document.head.appendChild(style);
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    initializeApp();
});

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    initializeApp();
});

// تهيئة زر تقليص الشريط الجانبي
function initSidebarToggle() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        
        // حفظ الحالة في localStorage
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    });
    
    // استعادة الحالة السابقة عند التحميل
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
    }
}

function initModals() {
    // إغلاق النافذة عند النقر خارج المحتوى
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // إغلاق النافذة عند الضغط على Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    // إظهار التنبيه مع تأثير
    setTimeout(() => {
        alertDiv.classList.add('show');
    }, 10);
    
    // إخفاء التنبيه بعد 3 ثواني
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 300);
    }, 3000);
}