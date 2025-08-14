// ملف المريض
let currentPatient = null;
let currentCard = null;

function loadPatientProfile(patient) {
    currentPatient = patient;
    
    // تحديث معلومات المريض
    document.getElementById('patientNameHeader').textContent = patient.name;
    document.getElementById('patientFullName').textContent = patient.name;
    document.getElementById('patientPhoneNumber').textContent = patient.phone;
    document.getElementById('patientEmailAddress').textContent = patient.email || 'غير متوفر';
    
    // إخفاء تبويب المرضى وإظهار ملف المريض
    document.getElementById('patients').classList.remove('active');
    document.getElementById('patientProfile').classList.add('active');
    
    // إنشاء البطاقات
    createPatientCards();
}

function createPatientCards() {
    const cardsContainer = document.querySelector('.patient-cards');
    cardsContainer.innerHTML = '';
    
    const cards = [
        { id: 'profile', title: 'الملف الشخصي', icon: 'fas fa-user', color: 'card-profile' },
        { id: 'medical', title: 'السجل الطبي', icon: 'fas fa-file-medical', color: 'card-medical' },
        { id: 'tests', title: 'الفحوصات', icon: 'fas fa-stethoscope', color: 'card-tests' },
        { id: 'payments', title: 'المدفوعات', icon: 'fas fa-money-bill-wave', color: 'card-payments' },
        { id: 'invoices', title: 'الفواتير', icon: 'fas fa-file-invoice', color: 'card-invoices' },
        { id: 'xray', title: 'الأشعة السينية', icon: 'fas fa-x-ray', color: 'card-xray' },
        { id: 'dental', title: 'مخطط الأسنان', icon: 'fas fa-tooth', color: 'card-dental' },
        { id: 'gum', title: 'فحص اللثة', icon: 'fas fa-teeth-open', color: 'card-gum' },
        { id: 'surgeries', title: 'العمليات', icon: 'fas fa-syringe', color: 'card-surgeries' },
        { id: 'prescriptions', title: 'الوصفات العلاجية', icon: 'fas fa-prescription-bottle', color: 'card-prescriptions' },
        { id: 'forms', title: 'النماذج', icon: 'fas fa-file-alt', color: 'card-forms' },
        { id: 'alerts', title: 'تنبيهات المريض', icon: 'fas fa-bell', color: 'card-alerts' },
        { id: 'lab', title: 'طلبات المعمل', icon: 'fas fa-vial', color: 'card-lab' },
        { id: 'inventory', title: 'المخزون المستخدم', icon: 'fas fa-boxes', color: 'card-inventory' }
    ];
    
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = `patient-card ${card.color}`;
        cardElement.dataset.card = card.id;
        cardElement.innerHTML = `
            <div class="card-icon">
                <i class="${card.icon}"></i>
            </div>
            <div class="card-title">${card.title}</div>
            <div class="card-info">${getCardInfo(card.id)}</div>
        `;
        
        cardElement.addEventListener('click', () => openCard(card.id));
        cardsContainer.appendChild(cardElement);
    });
}

function getCardInfo(cardId) {
    // يمكن استبدال هذا بمعلومات حقيقية من قاعدة البيانات
    const info = {
        profile: 'المعلومات الأساسية للمريض',
        medical: 'التاريخ الطبي والحالات السابقة',
        tests: 'نتائج الفحوصات والتحاليل',
        payments: 'سجل المدفوعات والرصيد',
        invoices: 'الفواتير الصادرة والمدفوعة',
        xray: 'صور الأشعة والتحاليل',
        dental: 'مخطط الأسنان والحالة الحالية',
        gum: 'فحوصات اللثة والتقريرات',
        surgeries: 'العمليات الجراحية السابقة',
        prescriptions: 'الأدوية والوصفات الحالية',
        forms: 'النماذج والتقارير الطبية',
        alerts: 'التنبيهات والمواعيد القادمة',
        lab: 'طلبات وتحاليل المعمل',
        inventory: 'المواد والمخزون المستخدم'
    };
    
    return info[cardId] || 'معلومات البطاقة';
}

function openCard(cardId) {
    currentCard = cardId;
    
    // إخفاء جميع البطاقات وإظهار محتوى البطاقة المحددة
    document.querySelectorAll('.patient-card').forEach(card => {
        card.style.display = 'none';
    });
    
    // إظهار محتوى البطاقة
    const contentContainer = document.querySelector('.card-content');
    contentContainer.innerHTML = `
        <div class="card-header">
            <button class="btn-back" id="backToCardsBtn">
                <i class="fas fa-arrow-right"></i> العودة إلى البطاقات
            </button>
            <h3>${getCardTitle(cardId)}</h3>
        </div>
        <div class="card-body">
            <p>سيتم عرض محتوى ${getCardTitle(cardId)} هنا. يمكن إضافة جداول وبيانات وملفات خاصة بهذا القسم.</p>
            <!-- سيتم ملؤه لاحقًا -->
        </div>
    `;
    
    contentContainer.classList.add('active');
    
    // إضافة حدث للعودة إلى البطاقات
    document.getElementById('backToCardsBtn').addEventListener('click', backToCards);
}

function getCardTitle(cardId) {
    const titles = {
        profile: 'الملف الشخصي',
        medical: 'السجل الطبي',
        tests: 'الفحوصات',
        payments: 'المدفوعات',
        invoices: 'الفواتير',
        xray: 'الأشعة السينية',
        dental: 'مخطط الأسنان',
        gum: 'فحص اللثة',
        surgeries: 'العمليات',
        prescriptions: 'الوصفات العلاجية',
        forms: 'النماذج',
        alerts: 'تنبيهات المريض',
        lab: 'طلبات المعمل',
        inventory: 'المخزون المستخدم'
    };
    
    return titles[cardId] || 'البطاقة';
}

function backToCards() {
    document.querySelector('.card-content').classList.remove('active');
    document.querySelectorAll('.patient-card').forEach(card => {
        card.style.display = 'block';
    });
}

function backToPatientsList() {
    document.getElementById('patientProfile').classList.remove('active');
    document.getElementById('patients').classList.add('active');
    
    // إعادة إظهار البطاقات عند العودة
    backToCards();
}

// تهيئة الأحداث
document.addEventListener('DOMContentLoaded', function() {
    // زر العودة إلى قائمة المرضى
    document.getElementById('backToPatientsBtn').addEventListener('click', backToPatientsList);
});

// دالة لتحميل وتفريغ المحتوى الديناميكي
function loadDynamicContent() {
    // إفراغ محتوى البطاقات
    const cardsContainer = document.querySelector('.patient-cards');
    cardsContainer.innerHTML = '';
    
    // إفراغ محتوى البطاقة المحددة
    const cardContent = document.querySelector('.card-content');
    cardContent.innerHTML = '';
}

// دالة لإظهار ملف المريض
function showPatientProfile(patient) {
    // إخفاء جميع التبويبات
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // إظهار تبويب ملف المريض
    document.getElementById('patientProfile').classList.add('active');

    // تحديث معلومات المريض
    document.getElementById('patientNameHeader').textContent = patient.name;
    document.getElementById('patientFullName').textContent = patient.name;
    document.getElementById('patientPhoneNumber').textContent = patient.phone;
    document.getElementById('patientEmailAddress').textContent = patient.email || 'غير متوفر';

    // مسح البطاقات القديمة
    const cardsContainer = document.querySelector('#patientProfile .patient-cards');
    cardsContainer.innerHTML = '';

    // إنشاء البطاقات الجديدة
    createPatientCards();

    // إعادة ربط أحداث البطاقات
    setTimeout(() => {
        document.querySelectorAll('.patient-card').forEach(card => {
            card.addEventListener('click', () => {
                const cardId = card.dataset.card;
                openCard(cardId);
            });
        });
    }, 100);
}


// دالة للتهيئة
function initPatientProfile() {
    console.log("تهيئة ملف المريض...");
    
    const backBtn = document.getElementById('backToPatientsBtn');
    if (backBtn) {
        backBtn.addEventListener('click', backToPatientsList);
        console.log("تم ربط زر العودة");
    } else {
        console.error("زر العودة غير موجود");
    }
}

// في نهاية الملف
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('patientProfile')) {
        initPatientProfile();
        
        // تهيئة أولية إذا كان هناك مريض معروض
        const patientId = new URLSearchParams(window.location.search).get('id');
        if (patientId) {
            const patients = JSON.parse(localStorage.getItem('patients')) || [];
            const patient = patients.find(p => p.id == patientId);
            if (patient) {
                showPatientProfile(patient);
            }
        }
    }
});