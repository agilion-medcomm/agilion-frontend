<<<<<<< HEAD

// ...existing code...
// server.cjs (TAM VE DÜZELTİLMİŞ VERSİYON)
// server.cjs (TAM VE DÜZELTİLMİŞ VERSİYON)

=======
<<<<<<< HEAD
// server.cjs (TAM VE DÜZELTİLMİŞ VERSİYON)
// server.cjs (TAM VE DÜZELTİLMİŞ VERSİYON)
=======
// src/components/Appointment/AppointmentV2Modal.jsx (GÜNCEL TASARIM VE MANTIK)
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc

>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
<<<<<<< HEAD
const PORT = 5000;

// VERİ TABANI YOLLARI
const DB_PATH = path.join(__dirname, 'patients.json');
=======
const PORT = 3000;

// VERİ TABANI YOLLARI
const DB_PATH = path.join(__dirname, 'patients.json');
<<<<<<< HEAD
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
const personnel_DB_PATH = path.join(__dirname, 'personnel.json');
const APPOINTMENTS_DB_PATH = path.join(__dirname, 'appointments.json');
const LEAVE_REQUESTS_DB_PATH = path.join(__dirname, 'leaveRequests.json');


async function readpersonnelDb() {
  try {
    const data = await fs.readFile(personnel_DB_PATH, 'utf-8');
    return JSON.parse(data.replace(/^\uFEFF/, ''));
  } catch (err) { return { personnel: [] }; }
}
async function writepersonnelDb(data) {
  await fs.writeFile(personnel_DB_PATH, JSON.stringify(data, null, 2));
}

app.use(express.json());
app.use(cors());

<<<<<<< HEAD
// === TÜM KULLANICILARI LİSTELE ===
app.get('/api/v1/patients', async (req, res) => {
  try {
    const db = await readDb();
    res.json({ users: db.users });
=======
// === YARDIMCI OKUMA/YAZMA FONKSİYONLARI ===
=======
const STAFF_DB_PATH = path.join(__dirname, 'staff.json');
const APPOINTMENTS_DB_PATH = path.join(__dirname, 'appointments.json');
console.log('__dirname:', __dirname);
console.log('STAFF_DB_PATH:', STAFF_DB_PATH);

app.use(express.json());
app.use(cors());
// === YARDIMCI FONKSİYONLAR ===
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
async function readDb() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) { return { users: [] }; }
}
async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

async function readpersonnelDb() {
  try {
    const data = await fs.readFile(personnel_DB_PATH, 'utf-8');
    return JSON.parse(data.replace(/^\uFEFF/, ''));
  } catch (err) { return { personnel: [] }; }
}
async function writepersonnelDb(data) {
  await fs.writeFile(personnel_DB_PATH, JSON.stringify(data, null, 2));
}

async function readAppointmentsDb() {
  try {
    const data = await fs.readFile(APPOINTMENTS_DB_PATH, 'utf-8');
    return JSON.parse(data);
<<<<<<< HEAD
  } catch (err) { return { appointments: [] }; }
=======
  } catch (err) {
    return { appointments: [] };
  }
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
}
async function writeAppointmentsDb(data) {
  await fs.writeFile(APPOINTMENTS_DB_PATH, JSON.stringify(data, null, 2));
}

<<<<<<< HEAD
async function readLeaveRequestsDb() {
  try {
    const data = await fs.readFile(LEAVE_REQUESTS_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) { return { requests: [] }; }
}
async function writeLeaveRequestsDb(data) {
  await fs.writeFile(LEAVE_REQUESTS_DB_PATH, JSON.stringify(data, null, 2));
}

// GÜNLÜK SLOTLARI OLUŞTURMA (09:00 - 17:00)
function getDailySlots() {
    const slots = [];
    for (let h = 9; h <= 17; h++) {
        for (let m of [0, 30]) {
            if (h === 17 && m > 0) continue;
            slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        }
    }
    return slots;
}

// RANDEVU İŞLEMLERİ
app.get('/api/v1/appointments', async (req, res) => {
    try {
        const { doctorId, date, list } = req.query;
        const appDb = await readAppointmentsDb();
        const leaveDb = await readLeaveRequestsDb(); // İzinleri oku
        
        // İptal edilmemiş randevuları al
        let activeAppointments = appDb.appointments.filter(a => a.status !== 'CANCELLED');

        // A) DOKTOR PANELİ İÇİN LİSTE İSTENİYORSA
        if (list === 'true') {
            let resultList = activeAppointments;
            if (doctorId) {
                resultList = resultList.filter(a => String(a.doctorId) === String(doctorId));
            }
            // Tarihe göre sırala (Yeniden eskiye)
            resultList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return res.json({ status: 'success', data: resultList });
        }

        // B) RANDEVU ALMA EKRANI İÇİN DOLU SAATLER (SLOTLAR) İSTENİYORSA
        // Onaylanmış izinleri filtrele
        const approvedLeaves = leaveDb.requests.filter(r => r.status === 'APPROVED');
        
        if (doctorId && date) {
            // 1. Mevcut Randevulardan gelen dolu saatler
            const appointmentsForDay = activeAppointments.filter(a => 
                String(a.doctorId) === String(doctorId) && 
                a.date === date
            );
            let bookedTimes = appointmentsForDay.map(a => a.time);

            // 2. İzinlerden kaynaklı dolu saatleri hesapla
            // Gelen tarih formatı "DD.MM.YYYY" (Örn: 25.11.2025) -> Bunu parse etmeliyiz
            const [day, month, year] = date.split('.');
            // Sorgulanan günün başlangıcı ve bitişi (09:00 - 17:00 arası kontrol edeceğiz)
            
            // O günün tüm slotlarını tek tek kontrol et: İzinle çakışıyor mu?
            const dailySlots = getDailySlots(); // ["09:00", "09:30", ...]

            dailySlots.forEach(slot => {
                // Bu slotun tam tarih/saat değeri
                const [h, m] = slot.split(':');
                const slotDate = new Date(year, month - 1, day, h, m); // Ay 0-indexlidir

                // Bu slot herhangi bir onaylı iznin aralığına giriyor mu?
                const isBlockedByLeave = approvedLeaves.some(leave => {
                    // Doktor ID kontrolü
                    if (String(leave.personnelId) !== String(doctorId)) return false;

                    // İzin başlangıç ve bitişini Date objesine çevir
                    const leaveStart = new Date(`${leave.startDate}T${leave.startTime}`);
                    const leaveEnd = new Date(`${leave.endDate}T${leave.endTime}`);

                    // Slot bu aralıkta mı?
                    return slotDate >= leaveStart && slotDate < leaveEnd;
                });

                if (isBlockedByLeave && !bookedTimes.includes(slot)) {
                    bookedTimes.push(slot);
                }
            });

            return res.json({ status: 'success', data: { bookedTimes: bookedTimes } });
        }
        
        return res.json({ status: 'success', data: { bookedTimes: [] } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Veri alınamadı: ' + error.message });
    }
});

=======
// === PUBLIC DOCTORS ENDPOINT ===
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
app.get('/api/v1/doctors', async (req, res) => {
  try {
    const personnelDb = await readpersonnelDb();
    const doctors = (personnelDb.personnel || []).filter(u => u.role === 'DOCTOR');
    const publicDoctors = doctors.map(u => ({
      id: u.id, 
      tckn: u.tckn, 
      firstName: u.firstName, 
      lastName: u.lastName,
      specialization: u.specialization || '', 
      img: u.photoUrl || '', 
      role: u.role
    }));
    res.json({ data: publicDoctors });
<<<<<<< HEAD
  } catch (error) { res.status(500).json({ message: error.message }); }
=======
  } catch (error) {
    res.status(500).json({ message: 'Doktorlar alınamadı: ' + error.message });
  }
});
// === ADMIN GİRİŞİ (login) ===
app.post('/api/v1/auth/admin-login', async (req, res) => {
  const { tckn, password } = req.body;
  const staffDb = await readStaffDb();
  console.log('Gelen tckn:', tckn, 'Gelen password:', password);
  const user = staffDb.personnel.find(u => String(u.tckn) === String(tckn) && u.password === password && u.role === 'ADMIN');
  if (!user) {
    console.log('Eşleşen admin yok. JSON:', staffDb.personnel);
    return res.status(401).json({ message: 'Böyle bir yönetici yok.' });
  }
  const token = `admin-token-${user.tckn}`;
  res.status(200).json({
    status: 'success',
    data: { token, role: user.role, firstName: user.firstName, lastName: user.lastName }
  });
});

// === PERSONEL EKLEME (admin yetkili) ===
app.post('/api/v1/staff', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    console.log('POST /api/v1/staff received token:', token);
    if (!token) {
      return res.status(401).json({ message: 'Sadece yönetici personel ekleyebilir.' });
    }

    let isAdmin = false;
    if (token.startsWith('admin-token-')) {
      // Eski admin token kontrolü
      const tckn = token.substring("admin-token-".length);
      const staffDb = await readStaffDb();
      const user = staffDb.personnel.find(u => String(u.tckn) === String(tckn) && u.role === 'ADMIN');
      if (user) isAdmin = true;
    } else if (token.startsWith('staff-token-')) {
      // Yeni staff token kontrolü
      const parts = token.split('-');
      const tckn = parts[2];
      const staffDb = await readStaffDb();
      const user = staffDb.personnel.find(u => String(u.tckn) === String(tckn) && u.role === 'ADMIN');
      if (user) isAdmin = true;
    }

    if (!isAdmin) {
      return res.status(401).json({ message: 'Sadece yönetici personel ekleyebilir.' });
    }

    // 🔥 KRİTİK DÜZELTME: specialization eklendi
    const { tckn, firstName, lastName, password, role, phoneNumber, email, dateOfBirth, specialization } = req.body;
    
    if (!tckn || !firstName || !lastName || !password || !role) {
      return res.status(400).json({ message: 'Personel bilgileri eksik.' });
    }
    const staffDb = await readStaffDb();
    if (staffDb.personnel.some(u => String(u.tckn) === String(tckn))) {
      return res.status(409).json({ message: 'TC Kimlik zaten kayıtlı.' });
    }
    
    // 🔥 KRİTİK DÜZELTME: specialization objeye eklendi
    const newStaff = {
      id: Date.now(),
      tckn,
      firstName,
      lastName,
      password,
      role,
      phoneNumber: phoneNumber || "",
      email: email || "", // email eklendi
      dateOfBirth: dateOfBirth || null, // dateOfBirth eklendi
      specialization: specialization || "" // specialization eklendi
    };
    
    staffDb.personnel.push(newStaff);
    await writeStaffDb(staffDb);
    res.status(201).json({ status: 'success', message: 'Personel eklendi', data: newStaff });
  } catch (error) {
    res.status(500).json({ message: 'Personel kaydedilemedi: ' + error.message });
  }
});
// === TÜM PERSONELLERİ LİSTELE (admin yetkili) ===
app.get('/api/v1/staff', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1];
  console.log('GET /api/v1/staff received token:', token);
  if (!token) {
    return res.status(401).json({ message: 'Sadece yönetici görebilir.' });
  }

  let isAdmin = false;
  if (token.startsWith('admin-token-')) {
    // Eski admin token kontrolü
    const tckn = token.substring("admin-token-".length);
    const staffDb = await readStaffDb();
    const user = staffDb.personnel.find(u => String(u.tckn) === String(tckn) && u.role === 'ADMIN');
    console.log('admin-token check, tckn:', tckn, 'user:', user);
    if (user) isAdmin = true;
  } else if (token.startsWith('staff-token-')) {
    // Yeni staff token kontrolü
    const parts = token.split('-');
    const tckn = parts[2];
    const staffDb = await readStaffDb();
    console.log('staffDb.personnel:', staffDb.personnel);
    const user = staffDb.personnel.find(u => String(u.tckn) === String(tckn) && u.role === 'ADMIN');
    console.log('staff-token check, tckn:', tckn, 'user:', user);
    if (user) isAdmin = true;
  }

  console.log('isAdmin:', isAdmin);
  if (!isAdmin) {
    return res.status(401).json({ message: 'Sadece yönetici görebilir.' });
  }

  const staffDb = await readStaffDb();
  const list = staffDb.personnel.map(({ password, ...rest }) => rest);
  res.json({ data: list });
});
// === PERSONEL GİRİŞİ ===
app.post('/api/v1/auth/staff-login', async (req, res) => {
  try {
    const { tckn, password } = req.body;
    const staffDb = await readStaffDb();
    const user = staffDb.personnel.find(u => String(u.tckn) === String(tckn) && u.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Böyle bir personel bulunamadı.' });
    }
    const mockToken = `staff-token-${user.tckn}-${user.role}`;
    const { password: _, ...userObj } = user;
    res.status(200).json({
      status: 'success',
      data: {
        token: mockToken,
        user: userObj
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// === HASTA GİRİŞİ (KULLANICI = USER olarak DÖNÜYOR) ===
app.post('/api/v1/auth/patient-login', async (req, res) => {
  try {
    const { tckn, password } = req.body;
    const db = await readDb();
    const user = db.users.find(u =>
      u.tckn === tckn && u.password === password
    );
    if (!user) {
      return res.status(401).json({ message: 'TC Kimlik veya şifre hatalı (Hasta bulunamadı).' });
    }
    const mockToken = `patient-token-${user.id}-${Date.now()}`;
    const { password: _, 
    ...userObj } = user;
    res.status(200).json({
      status: 'success',
      data: {
        token: mockToken,
        user: userObj
      }
    });
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// === PROFİL SORGULAMA ===
app.get('/api/v1/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });

<<<<<<< HEAD
// === YARDIMCI OKUMA/YAZMA FONKSİYONLARI ===
async function readDb() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) { return { users: [] }; }
}
async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

async function readpersonnelDb() {
  try {
    const data = await fs.readFile(personnel_DB_PATH, 'utf-8');
    return JSON.parse(data.replace(/^\uFEFF/, ''));
  } catch (err) { return { personnel: [] }; }
}
async function writepersonnelDb(data) {
  await fs.writeFile(personnel_DB_PATH, JSON.stringify(data, null, 2));
}

async function readAppointmentsDb() {
  try {
    const data = await fs.readFile(APPOINTMENTS_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) { return { appointments: [] }; }
}
async function writeAppointmentsDb(data) {
  await fs.writeFile(APPOINTMENTS_DB_PATH, JSON.stringify(data, null, 2));
}

async function readLeaveRequestsDb() {
  try {
    const data = await fs.readFile(LEAVE_REQUESTS_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) { return { requests: [] }; }
}
async function writeLeaveRequestsDb(data) {
  await fs.writeFile(LEAVE_REQUESTS_DB_PATH, JSON.stringify(data, null, 2));
}

// GÜNLÜK SLOTLARI OLUŞTURMA (09:00 - 17:00)
function getDailySlots() {
    const slots = [];
    for (let h = 9; h <= 17; h++) {
        for (let m of [0, 30]) {
            if (h === 17 && m > 0) continue;
            slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        }
    }
    return slots;
}

// RANDEVU İŞLEMLERİ
app.get('/api/v1/appointments', async (req, res) => {
    try {
        const { doctorId, date, list } = req.query;
        const appDb = await readAppointmentsDb();
        const leaveDb = await readLeaveRequestsDb(); // İzinleri oku
        
        // İptal edilmemiş randevuları al
        let activeAppointments = appDb.appointments.filter(a => a.status !== 'CANCELLED');

        // A) DOKTOR PANELİ İÇİN LİSTE İSTENİYORSA
        if (list === 'true') {
            let resultList = activeAppointments;
            if (doctorId) {
                resultList = resultList.filter(a => String(a.doctorId) === String(doctorId));
            }
            // Tarihe göre sırala (Yeniden eskiye)
            resultList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return res.json({ status: 'success', data: resultList });
        }

        // B) RANDEVU ALMA EKRANI İÇİN DOLU SAATLER (SLOTLAR) İSTENİYORSA
        // Onaylanmış izinleri filtrele
        const approvedLeaves = leaveDb.requests.filter(r => r.status === 'APPROVED');
        
        if (doctorId && date) {
            // 1. Mevcut Randevulardan gelen dolu saatler
            const appointmentsForDay = activeAppointments.filter(a => 
                String(a.doctorId) === String(doctorId) && 
                a.date === date
            );
            let bookedTimes = appointmentsForDay.map(a => a.time);

            // 2. İzinlerden kaynaklı dolu saatleri hesapla
            // Gelen tarih formatı "DD.MM.YYYY" (Örn: 25.11.2025) -> Bunu parse etmeliyiz
            const [day, month, year] = date.split('.');
            // Sorgulanan günün başlangıcı ve bitişi (09:00 - 17:00 arası kontrol edeceğiz)
            
            // O günün tüm slotlarını tek tek kontrol et: İzinle çakışıyor mu?
            const dailySlots = getDailySlots(); // ["09:00", "09:30", ...]

            dailySlots.forEach(slot => {
                // Bu slotun tam tarih/saat değeri
                const [h, m] = slot.split(':');
                const slotDate = new Date(year, month - 1, day, h, m); // Ay 0-indexlidir

                // Bu slot herhangi bir onaylı iznin aralığına giriyor mu?
                const isBlockedByLeave = approvedLeaves.some(leave => {
                    // Doktor ID kontrolü
                    if (String(leave.personnelId) !== String(doctorId)) return false;

                    // İzin başlangıç ve bitişini Date objesine çevir
                    const leaveStart = new Date(`${leave.startDate}T${leave.startTime}`);
                    const leaveEnd = new Date(`${leave.endDate}T${leave.endTime}`);

                    // Slot bu aralıkta mı?
                    return slotDate >= leaveStart && slotDate < leaveEnd;
                });

                if (isBlockedByLeave && !bookedTimes.includes(slot)) {
                    bookedTimes.push(slot);
                }
            });

            return res.json({ status: 'success', data: { bookedTimes: bookedTimes } });
        }
        
        return res.json({ status: 'success', data: { bookedTimes: [] } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Veri alınamadı: ' + error.message });
    }
});

app.get('/api/v1/doctors', async (req, res) => {
  try {
    const personnelDb = await readpersonnelDb();
    const doctors = (personnelDb.personnel || []).filter(u => u.role === 'DOCTOR');
    const publicDoctors = doctors.map(u => ({
      id: u.id, 
      tckn: u.tckn, 
      firstName: u.firstName, 
      lastName: u.lastName,
      specialization: u.specialization || '', 
      img: u.photoUrl || '', 
      role: u.role
    }));
    res.json({ data: publicDoctors });
  } catch (error) { res.status(500).json({ message: error.message }); }
=======
  const token = authHeader.split(' ')[1];

  // Personel Token Kontrolü
  if (token.startsWith('staff-token-')) {
    const parts = token.split('-');
    const tckn = parts[2];
    const staffDb = await readStaffDb();
    const user = staffDb.personnel.find(u => String(u.tckn) === String(tckn));
    if (user) {
      const { password, ...userInfo } = user;
      return res.json({ data: userInfo });
    }
  }
  // Admin Token ise admin sahibini dön
  if (token.startsWith('admin-token-')) {
    const tckn = token.substring("admin-token-".length);
    const staffDb = await readStaffDb();
    const user = staffDb.personnel.find(u => String(u.tckn) === String(tckn) && u.role === 'ADMIN');
    if (user) {
      const { password, ...userInfo } = user;
      return res.json({ data: { ...userInfo, isAdmin: true }});
    }
  }
  // Hasta
  if (token.startsWith('patient-token-')) {
    const parts = token.split('-');
    const userId = parseInt(parts[2]);
    const db = await readDb();
    const user = db.users.find(u => u.id === userId);
    if (user) {
      const { password, ...userInfo } = user;
      return res.json({ data: { ...userInfo, role: 'PATIENT' } });
    }
  }
  return res.status(404).json({ message: 'User not found' });
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
});

// === HASTA KAYIT (dateOfBirth ve phoneNumber alanı zorunlu) ===
app.post('/api/users', async (req, res) => {
  try {
    const { tckn, firstName, lastName, password, email, phoneNumber, dateOfBirth } = req.body;
    if (!tckn || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Zorunlu alanlar eksik.' });
<<<<<<< HEAD
    }
    const db = await readDb();
    const existingUser = db.users.find(u => u.tckn === tckn);
    if (existingUser) {
      return res.status(409).json({ message: 'Bu TC Kimlik numarası ile zaten bir kayıt mevcut.' });
    }
    const newUser = {
      id: Date.now(),
      tckn,
      firstName,
      lastName,
      password,
      email,
      phoneNumber: phoneNumber || "",
      dateOfBirth,
      role: 'PATIENT'
    };
    db.users.push(newUser);
    await writeDb(db);
    res.status(201).json({ status: 'success', message: 'Kayıt başarılı', data: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Kayıt sırasında hata oluştu: ' + error.message });
=======
    }
    const db = await readDb();
    const existingUser = db.users.find(u => u.tckn === tckn);
    if (existingUser) {
      return res.status(409).json({ message: 'Bu TC Kimlik numarası ile zaten bir kayıt mevcut.' });
    }
    const newUser = {
      id: Date.now(),
      tckn,
      firstName,
      lastName,
      password,
      email,
      phoneNumber: phoneNumber || "",
      dateOfBirth,
      role: 'PATIENT'
    };
    db.users.push(newUser);
    await writeDb(db);
    res.status(201).json({ status: 'success', message: 'Kayıt başarılı', data: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Kayıt sırasında hata oluştu: ' + error.message });
  }
});

// === RANDEVU OLUŞTURMA ===
app.post('/api/v1/appointments', async (req, res) => {
  try {
    // patientName yerine patientFirstName ve patientLastName alıyoruz
    const { doctorId, doctorName, patientId, patientFirstName, patientLastName, date, time, status } = req.body;

    if (!doctorId || !patientId || !date || !time) {
      return res.status(400).json({ message: 'Eksik randevu bilgileri.' });
    }

    const db = await readAppointmentsDb();
    
    // Çakışma Kontrolü
    const conflict = db.appointments.find(a => 
      a.doctorId === doctorId && 
      a.date === date && 
      a.time === time &&
      a.status !== 'CANCELLED'
    );

    if (conflict) {
      return res.status(409).json({ message: 'Bu saatte doktor dolu. Lütfen başka bir saat seçiniz.' });
    }

    const newAppointment = {
      id: Date.now(),
      doctorId,
      doctorName,
      patientId,
      patientFirstName, // Ayrı alan
      patientLastName,  // Ayrı alan
      date,
      time,
      status: status || 'PENDING',
      createdAt: new Date().toISOString()
    };

    db.appointments.push(newAppointment);
    await writeAppointmentsDb(db);

    res.status(201).json({ 
      status: 'success', 
      message: 'Randevu oluşturuldu', 
      data: newAppointment 
    });

  } catch (error) {
    res.status(500).json({ message: 'Randevu oluşturulamadı: ' + error.message });
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
  }
});

// === DOKTORA AİT DOLU SAATLERİ GETİR (Opsiyonel ama gerekli) ===
app.get('/api/v1/appointments', async (req, res) => {
    try {
        const { doctorId, date } = req.query;
        const db = await readAppointmentsDb();
        
        let filtered = db.appointments;
        
        // Eğer doktor ve tarih filtresi varsa uygula
        if (doctorId && date) {
            filtered = filtered.filter(a => 
                String(a.doctorId) === String(doctorId) && 
                a.date === date && 
                a.status !== 'CANCELLED'
            );
        }
        
        res.json({ status: 'success', data: filtered });
    } catch (error) {
        res.status(500).json({ message: 'Randevular alınamadı.' });
    }
});
<<<<<<< HEAD
=======



app.listen(PORT, () => {
  console.log(`✅ Mock Sunucu Hazır: http://localhost:${PORT}`);
});
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
// === PERSONEL GÜNCELLEME (PUT) ===
app.put('/api/v1/personnel/:id', async (req, res) => {
  try {
    const personnelId = parseInt(req.params.id);
    const updates = req.body; // { email: '...', phoneNumber: '...' } gibi

    const personnelDb = await readpersonnelDb();
    const userIndex = personnelDb.personnel.findIndex(u => u.id === personnelId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'Personel bulunamadı.' });
    }

    // Mevcut kullanıcıyı al, güncellemeleri üstüne yaz
<<<<<<< HEAD
    const updatedUser = { ...personnelDb.personnel[userIndex], ...updates };
=======
    const updatedUser = { ...staffDb.personnel[userIndex], ...updates };
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
   
    // Listeyi güncelle
    personnelDb.personnel[userIndex] = updatedUser;
    
    // Dosyaya yaz
    await writepersonnelDb(personnelDb);

    // Hassas veriyi çıkarıp döndür
    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPass } = updatedUser;

    res.status(200).json({ 
      status: 'success', 
      message: 'Bilgiler güncellendi.', 
      data: userWithoutPass 
    });

  } catch (error) {
    res.status(500).json({ message: 'Güncelleme hatası: ' 
    + error.message });
  }
});

// === PERSONEL SİLME (DELETE) ===
app.delete('/api/v1/personnel/:id', async (req, res) => {
  try {
    // 1. Yetki Kontrolü (Sadece Admin)
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Yetkisiz işlem.' });

    // Admin kontrolü (Basitçe token var mı diye bakıyoruz, detaylı kontrol yukarıdaki gibi yapılabilir)
    // Gerçek backend'de burada middleware olur.

    const personnelId = parseInt(req.params.id);
    const personnelDb = await readpersonnelDb();

    // 2. Personeli Bul
    const userIndex = personnelDb.personnel.findIndex(u => u.id === personnelId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'Personel bulunamadı.' });
    }

    // 3. Listeden Çıkar (Splice)
    const deletedUser = personnelDb.personnel.splice(userIndex, 1)[0];

    // 4. Dosyayı Kaydet
    await writepersonnelDb(personnelDb);

    res.status(200).json({ 
      status: 'success', 
      message: 'Personel silindi.',
      data: { id: deletedUser.id } 
    });

  } catch (error) {
    res.status(500).json({ message: 'Silme hatası: ' + error.message });
  }
});

// Endpoint: /api/v1/auth/personnel/login
app.post('/api/v1/auth/personnel/login', async (req, res) => {
  try {
    const { tckn, password } = req.body;
    const personnelDb = await readpersonnelDb();
    
    const user = personnelDb.personnel.find(u => String(u.tckn) === String(tckn) && u.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Personel bulunamadı veya şifre hatalı.' });
    }

    // Token oluştur (Format: personnel-token-{TCKN})
    // Frontend'de 'personnelToken' olarak saklanacak ama içeriği aynı kalabilir
    const token = `personnel-token-${user.tckn}`;
    const { password: _, ...userObj } = user;

    console.log(`✅ Personel Girişi: ${user.firstName} (${user.role})`);

    res.status(200).json({
      status: 'success',
      data: {
        token: token,
        user: userObj,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. HASTA GİRİŞİ
// Endpoint: /api/v1/auth/patient/login
app.post('/api/v1/auth/patient/login', async (req, res) => {
  try {
    const { tckn, password } = req.body;
    const db = await readDb();
    const user = db.users.find(u => u.tckn === tckn && u.password === password);
    if (!user) return res.status(401).json({ message: 'Kullanıcı bulunamadı.' });
    
    const { password: _, ...userObj } = user;
    res.json({ status: 'success', data: { token: `patient-${user.id}`, user: userObj } });
  } catch (error) { res.status(500).json({ message: error.message }); }
});


app.get('/api/v1/personnel', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    
    // Token format kontrolü
    if (!token || !token.startsWith('personnel-token-')) {
        return res.status(401).json({ message: 'Yetkisiz. Token formatı geçersiz.' });
    }

    const requestTckn = token.split('-')[2];
    const personnelDb = await readpersonnelDb();
    const requestUser = personnelDb.personnel.find(u => String(u.tckn) === String(requestTckn));

    // Admin yetki kontrolü
    if (!requestUser || requestUser.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Yetkisiz. Sadece Admin görebilir.' });
    }

    // Listeyi döndür
    const list = personnelDb.personnel.map(({ password, ...rest }) => rest);
    res.json({ status: 'success', data: list });
    
  } catch (error) { 
    res.status(500).json({ message: 'Sunucu hatası: ' + error.message }); 
  }
});

// 3. AUTH ME (Profil Sorgulama)
app.get('/api/v1/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });
  const token = authHeader.split(' ')[1];

  if (token.startsWith('personnel-token-')) {
    const tckn = token.split('-')[2];
    const personnelDb = await readpersonnelDb();
    const user = personnelDb.personnel.find(u => String(u.tckn) === String(tckn));
    if (user) { const { password, ...userInfo } = user; return res.json({ data: userInfo }); }
  }
  
  if (token.startsWith('patient-token-')) {
    const userId = parseInt(token.split('-')[2]);
    const db = await readDb();
    const user = db.users.find(u => u.id === userId);
    if (user) { const { password, ...userInfo } = user; return res.json({ data: { ...userInfo, role: 'PATIENT' } }); }
  }
  return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
});

// Endpoint: /api/v1/personnel/register
app.post('/api/v1/personnel/register', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];

    if (!token || !token.startsWith('personnel-token-')) return res.status(401).json({ message: 'Yetkisiz.' });

    const requestTckn = token.split('-')[2];
    const personnelDb = await readpersonnelDb();
    const requestUser = personnelDb.personnel.find(u => String(u.tckn) === String(requestTckn));

    if (!requestUser || requestUser.role !== 'ADMIN') return res.status(403).json({ message: 'Sadece Yönetici ekleyebilir.' });

    const { tckn, firstName, lastName, password, role, phoneNumber, email, dateOfBirth, specialization } = req.body;
    
    if (!tckn || !firstName || !lastName || !password || !role) return res.status(400).json({ message: 'Eksik bilgi.' });
    if (personnelDb.personnel.some(u => String(u.tckn) === String(tckn))) return res.status(409).json({ message: 'Kayıtlı TCKN.' });
    
    const newpersonnel = {
      id: Date.now(), tckn, firstName, lastName, password, role,
      phoneNumber: phoneNumber || "", email: email || "", dateOfBirth: dateOfBirth || null,
      specialization: role === 'DOCTOR' ? (specialization || "") : "" 
    };
    
    personnelDb.personnel.push(newpersonnel);
    await writepersonnelDb(personnelDb);
    res.status(201).json({ status: 'success', message: 'Personel eklendi.', data: newpersonnel });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// Endpoint: /api/v1/personnel/:id
app.delete('/api/v1/personnel/:id', async (req, res) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.split(' ')[1];
        if (!token || !token.startsWith('personnel-token-')) return res.status(401).json({ message: 'Yetkisiz.' });
        
        const personnelId = parseInt(req.params.id);
        const personnelDb = await readpersonnelDb();
        const idx = personnelDb.personnel.findIndex(u => u.id == personnelId);
        
        if (idx !== -1) {
            personnelDb.personnel.splice(idx, 1);
            await writepersonnelDb(personnelDb);
            res.json({ status: 'success', message: 'Silindi.' });
        } else { res.status(404).json({ message: 'Bulunamadı.' }); }
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Endpoint: /api/v1/personnel/:id
app.put('/api/v1/personnel/:id', async (req, res) => {
    try {
        const personnelId = parseInt(req.params.id);
        const updates = req.body; 
        const personnelDb = await readpersonnelDb();
        const idx = personnelDb.personnel.findIndex(u => u.id == personnelId);
        
        if (idx !== -1) {
            personnelDb.personnel[idx] = { ...personnelDb.personnel[idx], ...updates };
            await writepersonnelDb(personnelDb);
            const { password, ...cleanUser } = personnelDb.personnel[idx];
            res.json({ status: 'success', data: cleanUser });
        } else { res.status(404).json({ message: 'Bulunamadı.' }); }
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/v1/appointments', async (req, res) => {
  try {
    const { doctorId, doctorName, patientId, patientFirstName, patientLastName, date, time, status } = req.body;
    if (!doctorId || !patientId || !date || !time) return res.status(400).json({ message: 'Eksik bilgi.' });

    const db = await readAppointmentsDb();
    const conflict = db.appointments.find(a => a.doctorId === doctorId && a.date === date && a.time === time && a.status !== 'CANCELLED');
    if (conflict) return res.status(409).json({ message: 'Bu saat dolu.' });

    const newAppointment = {
      id: Date.now(), doctorId, doctorName, patientId, patientFirstName, patientLastName, date, time,
      status: status || 'APPROVED', createdAt: new Date().toISOString()
    };
    db.appointments.push(newAppointment);
    await writeAppointmentsDb(db);
    res.status(201).json({ status: 'success', data: newAppointment });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

app.get('/api/v1/appointments', async (req, res) => {
    try {
        const { doctorId, date, list } = req.query;
        const appDb = await readAppointmentsDb();
        const leaveDb = await readLeaveRequestsDb();
        let activeAppointments = appDb.appointments.filter(a => a.status !== 'CANCELLED');

        // Doktor Paneli için Liste
        if (list === 'true') {
            let resultList = activeAppointments;
            if (doctorId) resultList = resultList.filter(a => String(a.doctorId) === String(doctorId));
            resultList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return res.json({ status: 'success', data: resultList });
        }

        // Randevu Ekranı için Slotlar (İzin Kontrolü Dahil)
        const approvedLeaves = leaveDb.requests.filter(r => r.status === 'APPROVED');
        
        if (doctorId && date) {
            const appointmentsForDay = activeAppointments.filter(a => String(a.doctorId) === String(doctorId) && a.date === date);
            let bookedTimes = appointmentsForDay.map(a => a.time);

            const [day, month, year] = date.split('.');
            const dailySlots = getDailySlots();

            dailySlots.forEach(slot => {
                const [h, m] = slot.split(':');
                const slotDate = new Date(year, month - 1, day, h, m);
                const isBlocked = approvedLeaves.some(leave => {
                    if (String(leave.personnelId) !== String(doctorId)) return false;
                    const start = new Date(`${leave.startDate}T${leave.startTime}`);
                    const end = new Date(`${leave.endDate}T${leave.endTime}`);
                    return slotDate >= start && slotDate < end;
                });
                if (isBlocked && !bookedTimes.includes(slot)) bookedTimes.push(slot);
            });

            return res.json({ status: 'success', data: { bookedTimes } });
        }
        return res.json({ status: 'success', data: { bookedTimes: [] } });
    } catch (error) { res.status(500).json({ message: error.message }); }
});


app.put('/api/v1/appointments/:id/status', async (req, res) => {
    try {
        const appointmentId = parseInt(req.params.id);
        const { status } = req.body; 
        const db = await readAppointmentsDb();
        const appIndex = db.appointments.findIndex(a => a.id === appointmentId);
        if (appIndex === -1) return res.status(404).json({ message: 'Bulunamadı.' });
        db.appointments[appIndex].status = status;
        await writeAppointmentsDb(db);
        res.json({ status: 'success', data: db.appointments[appIndex] });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

// İZİN TALEBİ OLUŞTURMA
app.post('/api/v1/leave-requests', async (req, res) => {
  try {
    const { personnelId, personnelFirstName, personnelLastName, personnelRole, startDate, startTime, endDate, endTime, reason } = req.body;
    const db = await readLeaveRequestsDb();
    const newRequest = {
      id: Date.now(), personnelId, personnelFirstName, personnelLastName, personnelRole,
      startDate, startTime, endDate, endTime, reason, status: 'PENDING', requestedAt: new Date().toISOString()
    };
    db.requests.push(newRequest);
    await writeLeaveRequestsDb(db);
    res.status(201).json({ status: 'success', data: newRequest });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// İZİN LİSTELEME
app.get('/api/v1/leave-requests', async (req, res) => {
    try { const db = await readLeaveRequestsDb(); res.json({ status: 'success', data: db.requests }); }
    catch (error) { res.status(500).json({ message: 'Hata.' }); }
});

// İZİN ONAYLAMA/REDDETME
app.put('/api/v1/leave-requests/:id/status', async (req, res) => {
    try {
        const requestId = parseInt(req.params.id);
        const { status } = req.body;
        const db = await readLeaveRequestsDb();
        const idx = db.requests.findIndex(r => r.id === requestId);
        if (idx === -1) return res.status(404).json({ message: 'Bulunamadı.' });
        db.requests[idx].status = status;
        await writeLeaveRequestsDb(db);
        res.json({ status: 'success' });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

app.post('/api/users', async (req, res) => {
    try {
        const db = await readDb();
        const newUser = { id: Date.now(), role: 'PATIENT', ...req.body };
        db.users.push(newUser);
        await writeDb(db);
        res.status(201).json({ status: 'success', data: newUser });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/v1/patients', async (req, res) => {
  try { const db = await readDb(); res.json({ users: db.users }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

app.listen(PORT, () => {
<<<<<<< HEAD
  console.log(`✅ Mock Sunucu Hazır: http://localhost:${PORT}`);
});
// === PERSONEL GÜNCELLEME (PUT) ===
app.put('/api/v1/personnel/:id', async (req, res) => {
  try {
    const personnelId = parseInt(req.params.id);
    const updates = req.body; // { email: '...', phoneNumber: '...' } gibi

    const personnelDb = await readpersonnelDb();
    const userIndex = personnelDb.personnel.findIndex(u => u.id === personnelId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'Personel bulunamadı.' });
    }

    // Mevcut kullanıcıyı al, güncellemeleri üstüne yaz
    const updatedUser = { ...personnelDb.personnel[userIndex], ...updates };
   
    // Listeyi güncelle
    personnelDb.personnel[userIndex] = updatedUser;
    
    // Dosyaya yaz
    await writepersonnelDb(personnelDb);

    // Hassas veriyi çıkarıp döndür
    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPass } = updatedUser;

    res.status(200).json({ 
      status: 'success', 
      message: 'Bilgiler güncellendi.', 
      data: userWithoutPass 
    });

  } catch (error) {
    res.status(500).json({ message: 'Güncelleme hatası: ' 
    + error.message });
  }
});

// === PERSONEL SİLME (DELETE) ===
app.delete('/api/v1/personnel/:id', async (req, res) => {
  try {
    // 1. Yetki Kontrolü (Sadece Admin)
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Yetkisiz işlem.' });

    // Admin kontrolü (Basitçe token var mı diye bakıyoruz, detaylı kontrol yukarıdaki gibi yapılabilir)
    // Gerçek backend'de burada middleware olur.

    const personnelId = parseInt(req.params.id);
    const personnelDb = await readpersonnelDb();

    // 2. Personeli Bul
    const userIndex = personnelDb.personnel.findIndex(u => u.id === personnelId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'Personel bulunamadı.' });
    }

    // 3. Listeden Çıkar (Splice)
    const deletedUser = personnelDb.personnel.splice(userIndex, 1)[0];

    // 4. Dosyayı Kaydet
    await writepersonnelDb(personnelDb);

    res.status(200).json({ 
      status: 'success', 
      message: 'Personel silindi.',
      data: { id: deletedUser.id } 
    });

  } catch (error) {
    res.status(500).json({ message: 'Silme hatası: ' + error.message });
  }
});

// Endpoint: /api/v1/auth/personnel/login
app.post('/api/v1/auth/personnel/login', async (req, res) => {
  try {
    const { tckn, password } = req.body;
    const personnelDb = await readpersonnelDb();
    
    const user = personnelDb.personnel.find(u => String(u.tckn) === String(tckn) && u.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Personel bulunamadı veya şifre hatalı.' });
    }

    // Token oluştur (Format: personnel-token-{TCKN})
    // Frontend'de 'personnelToken' olarak saklanacak ama içeriği aynı kalabilir
    const token = `personnel-token-${user.tckn}`;
    const { password: _, ...userObj } = user;

    console.log(`✅ Personel Girişi: ${user.firstName} (${user.role})`);

    res.status(200).json({
      status: 'success',
      data: {
        token: token,
        user: userObj,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. HASTA GİRİŞİ
// Endpoint: /api/v1/auth/patient/login
app.post('/api/v1/auth/patient/login', async (req, res) => {
  try {
    const { tckn, password } = req.body;
    const db = await readDb();
    const user = db.users.find(u => u.tckn === tckn && u.password === password);
    if (!user) return res.status(401).json({ message: 'Kullanıcı bulunamadı.' });
    
    const { password: _, ...userObj } = user;
    res.json({ status: 'success', data: { token: `patient-${user.id}`, user: userObj } });
  } catch (error) { res.status(500).json({ message: error.message }); }
});


app.get('/api/v1/personnel', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    
    // Token format kontrolü
    if (!token || !token.startsWith('personnel-token-')) {
        return res.status(401).json({ message: 'Yetkisiz. Token formatı geçersiz.' });
    }

    const requestTckn = token.split('-')[2];
    const personnelDb = await readpersonnelDb();
    const requestUser = personnelDb.personnel.find(u => String(u.tckn) === String(requestTckn));

    // Admin yetki kontrolü
    if (!requestUser || requestUser.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Yetkisiz. Sadece Admin görebilir.' });
    }

    // Listeyi döndür
    const list = personnelDb.personnel.map(({ password, ...rest }) => rest);
    res.json({ status: 'success', data: list });
    
  } catch (error) { 
    res.status(500).json({ message: 'Sunucu hatası: ' + error.message }); 
  }
});

// 3. AUTH ME (Profil Sorgulama)
app.get('/api/v1/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });
  const token = authHeader.split(' ')[1];

  if (token.startsWith('personnel-token-')) {
    const tckn = token.split('-')[2];
    const personnelDb = await readpersonnelDb();
    const user = personnelDb.personnel.find(u => String(u.tckn) === String(tckn));
    if (user) { const { password, ...userInfo } = user; return res.json({ data: userInfo }); }
  }
  
  if (token.startsWith('patient-token-')) {
    const userId = parseInt(token.split('-')[2]);
    const db = await readDb();
    const user = db.users.find(u => u.id === userId);
    if (user) { const { password, ...userInfo } = user; return res.json({ data: { ...userInfo, role: 'PATIENT' } }); }
  }
  return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
});

// Endpoint: /api/v1/personnel/register
app.post('/api/v1/personnel/register', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];

    if (!token || !token.startsWith('personnel-token-')) return res.status(401).json({ message: 'Yetkisiz.' });

    const requestTckn = token.split('-')[2];
    const personnelDb = await readpersonnelDb();
    const requestUser = personnelDb.personnel.find(u => String(u.tckn) === String(requestTckn));

    if (!requestUser || requestUser.role !== 'ADMIN') return res.status(403).json({ message: 'Sadece Yönetici ekleyebilir.' });

    const { tckn, firstName, lastName, password, role, phoneNumber, email, dateOfBirth, specialization } = req.body;
    
    if (!tckn || !firstName || !lastName || !password || !role) return res.status(400).json({ message: 'Eksik bilgi.' });
    if (personnelDb.personnel.some(u => String(u.tckn) === String(tckn))) return res.status(409).json({ message: 'Kayıtlı TCKN.' });
    
    const newpersonnel = {
      id: Date.now(), tckn, firstName, lastName, password, role,
      phoneNumber: phoneNumber || "", email: email || "", dateOfBirth: dateOfBirth || null,
      specialization: role === 'DOCTOR' ? (specialization || "") : "" 
    };
    
    personnelDb.personnel.push(newpersonnel);
    await writepersonnelDb(personnelDb);
    res.status(201).json({ status: 'success', message: 'Personel eklendi.', data: newpersonnel });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// Endpoint: /api/v1/personnel/:id
app.delete('/api/v1/personnel/:id', async (req, res) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.split(' ')[1];
        if (!token || !token.startsWith('personnel-token-')) return res.status(401).json({ message: 'Yetkisiz.' });
        
        const personnelId = parseInt(req.params.id);
        const personnelDb = await readpersonnelDb();
        const idx = personnelDb.personnel.findIndex(u => u.id == personnelId);
        
        if (idx !== -1) {
            personnelDb.personnel.splice(idx, 1);
            await writepersonnelDb(personnelDb);
            res.json({ status: 'success', message: 'Silindi.' });
        } else { res.status(404).json({ message: 'Bulunamadı.' }); }
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Endpoint: /api/v1/personnel/:id
app.put('/api/v1/personnel/:id', async (req, res) => {
    try {
        const personnelId = parseInt(req.params.id);
        const updates = req.body; 
        const personnelDb = await readpersonnelDb();
        const idx = personnelDb.personnel.findIndex(u => u.id == personnelId);
        
        if (idx !== -1) {
            personnelDb.personnel[idx] = { ...personnelDb.personnel[idx], ...updates };
            await writepersonnelDb(personnelDb);
            const { password, ...cleanUser } = personnelDb.personnel[idx];
            res.json({ status: 'success', data: cleanUser });
        } else { res.status(404).json({ message: 'Bulunamadı.' }); }
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/v1/appointments', async (req, res) => {
  try {
    const { doctorId, doctorName, patientId, patientFirstName, patientLastName, date, time, status } = req.body;
    if (!doctorId || !patientId || !date || !time) return res.status(400).json({ message: 'Eksik bilgi.' });

    const db = await readAppointmentsDb();
    const conflict = db.appointments.find(a => a.doctorId === doctorId && a.date === date && a.time === time && a.status !== 'CANCELLED');
    if (conflict) return res.status(409).json({ message: 'Bu saat dolu.' });

    const newAppointment = {
      id: Date.now(), doctorId, doctorName, patientId, patientFirstName, patientLastName, date, time,
      status: status || 'APPROVED', createdAt: new Date().toISOString()
    };
    db.appointments.push(newAppointment);
    await writeAppointmentsDb(db);
    res.status(201).json({ status: 'success', data: newAppointment });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

app.get('/api/v1/appointments', async (req, res) => {
    try {
        const { doctorId, date, list } = req.query;
        const appDb = await readAppointmentsDb();
        const leaveDb = await readLeaveRequestsDb();
        let activeAppointments = appDb.appointments.filter(a => a.status !== 'CANCELLED');

        // Doktor Paneli için Liste
        if (list === 'true') {
            let resultList = activeAppointments;
            if (doctorId) resultList = resultList.filter(a => String(a.doctorId) === String(doctorId));
            resultList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return res.json({ status: 'success', data: resultList });
        }

        // Randevu Ekranı için Slotlar (İzin Kontrolü Dahil)
        const approvedLeaves = leaveDb.requests.filter(r => r.status === 'APPROVED');
        
        if (doctorId && date) {
            const appointmentsForDay = activeAppointments.filter(a => String(a.doctorId) === String(doctorId) && a.date === date);
            let bookedTimes = appointmentsForDay.map(a => a.time);

            const [day, month, year] = date.split('.');
            const dailySlots = getDailySlots();

            dailySlots.forEach(slot => {
                const [h, m] = slot.split(':');
                const slotDate = new Date(year, month - 1, day, h, m);
                const isBlocked = approvedLeaves.some(leave => {
                    if (String(leave.personnelId) !== String(doctorId)) return false;
                    const start = new Date(`${leave.startDate}T${leave.startTime}`);
                    const end = new Date(`${leave.endDate}T${leave.endTime}`);
                    return slotDate >= start && slotDate < end;
                });
                if (isBlocked && !bookedTimes.includes(slot)) bookedTimes.push(slot);
            });

            return res.json({ status: 'success', data: { bookedTimes } });
        }
        return res.json({ status: 'success', data: { bookedTimes: [] } });
    } catch (error) { res.status(500).json({ message: error.message }); }
});


app.put('/api/v1/appointments/:id/status', async (req, res) => {
    try {
        const appointmentId = parseInt(req.params.id);
        const { status } = req.body; 
        const db = await readAppointmentsDb();
        const appIndex = db.appointments.findIndex(a => a.id === appointmentId);
        if (appIndex === -1) return res.status(404).json({ message: 'Bulunamadı.' });
        db.appointments[appIndex].status = status;
        await writeAppointmentsDb(db);
        res.json({ status: 'success', data: db.appointments[appIndex] });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

// İZİN TALEBİ OLUŞTURMA
app.post('/api/v1/leave-requests', async (req, res) => {
  try {
    const { personnelId, personnelFirstName, personnelLastName, personnelRole, startDate, startTime, endDate, endTime, reason } = req.body;
    const db = await readLeaveRequestsDb();
    const newRequest = {
      id: Date.now(), personnelId, personnelFirstName, personnelLastName, personnelRole,
      startDate, startTime, endDate, endTime, reason, status: 'PENDING', requestedAt: new Date().toISOString()
    };
    db.requests.push(newRequest);
    await writeLeaveRequestsDb(db);
    res.status(201).json({ status: 'success', data: newRequest });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// İZİN LİSTELEME
app.get('/api/v1/leave-requests', async (req, res) => {
    try { const db = await readLeaveRequestsDb(); res.json({ status: 'success', data: db.requests }); }
    catch (error) { res.status(500).json({ message: 'Hata.' }); }
});

// İZİN ONAYLAMA/REDDETME
app.put('/api/v1/leave-requests/:id/status', async (req, res) => {
    try {
        const requestId = parseInt(req.params.id);
        const { status } = req.body;
        const db = await readLeaveRequestsDb();
        const idx = db.requests.findIndex(r => r.id === requestId);
        if (idx === -1) return res.status(404).json({ message: 'Bulunamadı.' });
        db.requests[idx].status = status;
        await writeLeaveRequestsDb(db);
        res.json({ status: 'success' });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

app.post('/api/users', async (req, res) => {
    try {
        const db = await readDb();
        const newUser = { id: Date.now(), role: 'PATIENT', ...req.body };
        db.users.push(newUser);
        await writeDb(db);
        res.status(201).json({ status: 'success', data: newUser });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/v1/patients', async (req, res) => {
  try { const db = await readDb(); res.json({ users: db.users }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

app.listen(PORT, () => {
=======
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
  console.log(`✅ Sunucu Çalışıyor: http://localhost:${PORT}`);
});
