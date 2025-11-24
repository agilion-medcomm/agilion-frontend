// src/components/Appointment/AppointmentV2Modal.jsx (GÜNCEL TASARIM VE MANTIK)

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// DİKKAT: Burada artık patients.json ve staff.json kullanıyorsun.
const DB_PATH = path.join(__dirname, 'patients.json');
const STAFF_DB_PATH = path.join(__dirname, 'staff.json');
const APPOINTMENTS_DB_PATH = path.join(__dirname, 'appointments.json');
console.log('__dirname:', __dirname);
console.log('STAFF_DB_PATH:', STAFF_DB_PATH);

app.use(express.json());
app.use(cors());
// === YARDIMCI FONKSİYONLAR ===
async function readDb() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return { users: [] };
  }
}
async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}
async function readStaffDb() {
  try {
    console.log('Reading staff.json from:', STAFF_DB_PATH);
    const data = await fs.readFile(STAFF_DB_PATH, 'utf-8');
    console.log('Staff data length:', data.length);
    const cleanData = data.replace(/^\uFEFF/, ''); // Remove BOM if present
    const parsed = JSON.parse(cleanData);
    console.log('Parsed personnel length:', parsed.personnel.length);
    return parsed;
  } catch (err) {
    console.log('Error reading staff.json:', err.message);
    return { personnel: [] };
  }
}
async function writeStaffDb(data) {
  await fs.writeFile(STAFF_DB_PATH, JSON.stringify(data, null, 2));
}

async function readAppointmentsDb() {
  try {
    const data = await fs.readFile(APPOINTMENTS_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return { appointments: [] };
  }
}
async function writeAppointmentsDb(data) {
  await fs.writeFile(APPOINTMENTS_DB_PATH, JSON.stringify(data, null, 2));
}

// === PUBLIC DOCTORS ENDPOINT ===
app.get('/api/v1/doctors', async (req, res) => {
  try {
    const staffDb = await readStaffDb();
    const doctors = (staffDb.personnel || []).filter(u => u.role === 'DOCTOR');
    // Sadece bazı alanları döndür
    const publicDoctors = doctors.map(u => ({
      id: u.id,
      tckn: u.tckn,
      firstName: u.firstName,
      lastName: u.lastName,
      specialization: u.specialization || '',
      phoneNumber: u.phoneNumber || '',
      email: u.email || '',
      role: u.role
    }));
    res.json({ data: publicDoctors });
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
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası: ' + error.message });
  }
});
// === PROFİL SORGULAMA ===
app.get('/api/v1/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });

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
});

// === HASTA KAYIT (dateOfBirth ve phoneNumber alanı zorunlu) ===
app.post('/api/users', async (req, res) => {
  try {
    const { tckn, firstName, lastName, password, email, phoneNumber, dateOfBirth } = req.body;
    if (!tckn || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Zorunlu alanlar eksik.' });
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



app.listen(PORT, () => {
  console.log(`✅ Mock Sunucu Hazır: http://localhost:${PORT}`);
});
// === PERSONEL GÜNCELLEME (PUT) ===
app.put('/api/v1/staff/:id', async (req, res) => {
  try {
    const staffId = parseInt(req.params.id);
    const updates = req.body; // { email: '...', phoneNumber: '...' } gibi

    const staffDb = await readStaffDb();
    const userIndex = staffDb.personnel.findIndex(u => u.id === staffId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'Personel bulunamadı.' });
    }

    // Mevcut kullanıcıyı al, güncellemeleri üstüne yaz
    const updatedUser = { ...staffDb.personnel[userIndex], ...updates };
   
    // Listeyi güncelle
    staffDb.personnel[userIndex] = updatedUser;
    
    // Dosyaya yaz
    await writeStaffDb(staffDb);

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
app.delete('/api/v1/staff/:id', async (req, res) => {
  try {
    // 1. Yetki Kontrolü (Sadece Admin)
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Yetkisiz işlem.' });

    // Admin kontrolü (Basitçe token var mı diye bakıyoruz, detaylı kontrol yukarıdaki gibi yapılabilir)
    // Gerçek backend'de burada middleware olur.

    const staffId = parseInt(req.params.id);
    const staffDb = await readStaffDb();

    // 2. Personeli Bul
    const userIndex = staffDb.personnel.findIndex(u => u.id === staffId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'Personel bulunamadı.' });
    }

    // 3. Listeden Çıkar (Splice)
    const deletedUser = staffDb.personnel.splice(userIndex, 1)[0];

    // 4. Dosyayı Kaydet
    await writeStaffDb(staffDb);

    res.status(200).json({ 
      status: 'success', 
      message: 'Personel silindi.',
      data: { id: deletedUser.id } 
    });

  } catch (error) {
    res.status(500).json({ message: 'Silme hatası: ' + error.message });
  }
});