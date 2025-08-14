// تهيئة إدارة المرضى
function initPatients() {
    loadPatients();
    
    // أحداث الأزرار
    document.getElementById('addPatientBtn').addEventListener('click', function() {
        openPatientModal(); // بدون أي معامل
    });
    
    document.getElementById('cancelPatientBtn').addEventListener('click', closePatientModal);
    document.getElementById('patientForm').addEventListener('submit', savePatient);
    document.getElementById('patientSearch').addEventListener('input', searchPatients);
    
    // تأكيد ربط زر الإغلاق
    document.querySelector('#patientModal .close').addEventListener('click', closePatientModal);
}

// تحميل المرضى
function loadPatients() {
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    const tbody = document.getElementById('patientsTableBody');
    tbody.innerHTML = '';
    
    if (patients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد بيانات</td></tr>';
        return;
    }
    
    patients.forEach((patient, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.phone}</td>
            <td>${new Date(patient.registrationDate).toLocaleDateString('ar-EG')}</td>
            <td class="action-buttons">
                <button class="action-btn btn-edit" onclick="editPatient(${patient.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn btn-delete" onclick="deletePatient(${patient.id})">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="action-btn btn-view" onclick="viewPatient(${patient.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
}

// فتح نافذة إضافة مريض
function openPatientModal(patient = null) {
    const modal = document.getElementById('patientModal');
    const title = document.getElementById('modalPatientTitle');
    
    // إعادة تعيين القيم أولاً
    document.getElementById('patientId').value = '';
    document.getElementById('patientName').value = '';
    document.getElementById('patientAge').value = '';
    document.getElementById('patientPhone').value = '';
    document.getElementById('patientEmail').value = '';
    document.getElementById('patientAddress').value = '';
    document.getElementById('patientNotes').value = '';
    
    // تحديد حالة النافذة (إضافة أم تعديل)
    if (patient) {
        title.textContent = 'تعديل بيانات المريض';
        document.getElementById('patientId').value = patient.id || '';
        document.getElementById('patientName').value = patient.name || '';
        document.getElementById('patientAge').value = patient.age || '';
        document.getElementById('patientPhone').value = patient.phone || '';
        document.getElementById('patientEmail').value = patient.email || '';
        document.getElementById('patientAddress').value = patient.address || '';
        document.getElementById('patientNotes').value = patient.notes || '';
    } else {
        title.textContent = 'إضافة مريض جديد';
    }
    
    // إعداد تأثيرات الحركة
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
        
        // إضافة مستمع لزر الإغلاق
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = closePatientModal; // تأكيد الربط
    }, 10);
}

function closePatientModal() {
    const modal = document.getElementById('patientModal');
    
    // تأثير الإغلاق
    modal.classList.remove('active');
    
    // تأخير إخفاء النافذة لإنهاء التأثير
    setTimeout(() => {
        modal.style.display = 'none';
        document.getElementById('patientForm').reset();
    }, 300);
}

// حفظ المريض
function savePatient(e) {
    e.preventDefault();
    
    const patientId = document.getElementById('patientId').value;
    const name = document.getElementById('patientName').value;
    const age = document.getElementById('patientAge').value;
    const phone = document.getElementById('patientPhone').value;
    const email = document.getElementById('patientEmail').value;
    const address = document.getElementById('patientAddress').value;
    const notes = document.getElementById('patientNotes').value;
    
    if (!name || !age || !phone) {
        alert('يرجى ملء الحقول المطلوبة');
        return;
    }
    
    let patients = JSON.parse(localStorage.getItem('patients')) || [];
    
    if (patientId) {
        // تحديث المريض الموجود
        const index = patients.findIndex(p => p.id == patientId);
        if (index !== -1) {
            patients[index] = {
                ...patients[index],
                name,
                age,
                phone,
                email,
                address,
                notes
            };
        }
    } else {
        // إضافة مريض جديد
        const newPatient = {
            id: Date.now(),
            name,
            age,
            phone,
            email,
            address,
            notes,
            registrationDate: new Date().toISOString()
        };
        patients.push(newPatient);
    }
    
    localStorage.setItem('patients', JSON.stringify(patients));
    closePatientModal();
    loadPatients();
    loadDashboardData(); // تحديث لوحة التحكم
    alert('تم حفظ بيانات المريض بنجاح');
}

// تعديل المريض
function editPatient(id) {
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    const patient = patients.find(p => p.id == id);
    if (patient) {
        openPatientModal(patient); // تمرير المريض للتعديل
    } else {
        alert('لم يتم العثور على المريض');
    }
}

// حذف المريض
function deletePatient(id) {
    if (confirm('هل أنت متأكد من حذف هذا المريض؟ سيتم حذف جميع بياناته الدائمة.')) {
        let patients = JSON.parse(localStorage.getItem('patients')) || [];
        patients = patients.filter(p => p.id != id);
        localStorage.setItem('patients', JSON.stringify(patients));
        loadPatients();
        alert('تم حذف المريض بنجاح');
    }
}

// عرض المريض
function viewPatient(id) {
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    const patient = patients.find(p => p.id == id);

    if (patient) {
        // إخفاء جميع التبويبات وإظهار تبويب ملف المريض
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.getElementById('patientProfile').classList.add('active');
        
        // تحديث عنوان الصفحة
        const titleEl = document.querySelector('.page-title span');
        const iconEl = document.querySelector('.page-title i');
        if (titleEl) titleEl.textContent = 'ملف المريض';
        if (iconEl) iconEl.className = 'fas fa-user-injured';

        // تحديث التبويب النشط في القائمة الجانبية
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector('.nav-item[data-tab="patients"]').classList.add('active');

        // تحميل بيانات المريض وإنشاء البطاقات
        showPatientProfile(patient);
        
        // تهيئة الأحداث الخاصة بملف المريض
        initPatientProfile();
    } else {
        alert('لم يتم العثور على المريض');
    }
}





// البحث عن المرضى
function searchPatients() {
    const searchTerm = document.getElementById('patientSearch').value.toLowerCase();
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    const filtered = patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.phone.includes(searchTerm)
    );
    
    const tbody = document.getElementById('patientsTableBody');
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد نتائج</td></tr>';
        return;
    }
    
    filtered.forEach((patient, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.phone}</td>
            <td>${new Date(patient.registrationDate).toLocaleDateString('ar-EG')}</td>
            <td class="action-buttons">
                <button class="action-btn btn-edit" onclick="editPatient(${patient.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn btn-delete" onclick="deletePatient(${patient.id})">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="action-btn btn-view" onclick="viewPatient(${patient.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function closePatientModal() {
    const modal = document.getElementById('patientModal');
    modal.classList.remove('active');
    
    // تأثير إغلاق متحرك
    modal.querySelector('.modal-content').style.animation = 'modalClose 0.3s ease-in';
    setTimeout(() => {
        modal.classList.remove('active');
        modal.querySelector('.modal-content').style.animation = '';
    }, 300);
}

// تهيئة إدارة المرضى عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('patientsTable')) {
        initPatients();
    }
});