// Express.js sunucusu - json-server'a ihtiyaç duymaz
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

// __dirname'i ES modüllerinde kullanmak için standart yöntem
const __filename = new URL(import.meta.url).pathname.substring(1); // Windows için baştaki / işaretini kaldır
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(express.json());
app.use(cors());

// Login Adresi
app.post('/api/auth/login', async (req, res) => {
  try {
    const { tcKimlik, password } = req.body;
    if (!tcKimlik || !password) return res.status(400).json({ message: 'Eksik bilgi.' });

    const dbRaw = await fs.readFile(DB_PATH, 'utf-8');
    const db = JSON.parse(dbRaw);
    const user = db.users.find(u => u.tcKimlik === tcKimlik && u.password === password);

    if (!user) return res.status(401).json({ message: 'TC veya şifre yanlış.' });

    const { password: pw, ...userWithoutPassword } = user;
    const mockToken = `mock-token-${user.id}-${Date.now()}`;
    res.status(200).json({ token: mockToken, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası: ' + error.message });
  }
});

// Kayıt Adresi
app.post('/api/users', async (req, res) => {
  try {
    const dbRaw = await fs.readFile(DB_PATH, 'utf-8');
    const db = JSON.parse(dbRaw);
    
    // TC'nin zaten var olup olmadığını kontrol et
    const existingUser = db.users.find(u => u.tcKimlik === req.body.tcKimlik);
    if(existingUser) {
        return res.status(409).json({ message: 'Bu TC Kimlik Numarası zaten kayıtlı.' });
    }

    const newUser = { id: Date.now(), ...req.body };
    db.users.push(newUser);
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Express Backend Sunucusu http://localhost:${PORT} adresinde çalışıyor.`);
  console.log('Login ve Register endpointleri aktif.');
});