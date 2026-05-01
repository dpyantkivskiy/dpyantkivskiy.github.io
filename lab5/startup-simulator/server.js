const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('build'));

app.get('/api/company', async (req, res) => {
  try {
    const doc = await db.collection('startups').doc('my-company').get();
    if (!doc.exists) {
      return res.json({ name: 'Новий Стартап', description: 'Опис відсутній' });
    }
    res.json(doc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/company', async (req, res) => {
  const { name, description } = req.body;

  if (!name || name.length < 5) {
    return res.status(400).json({ error: 'Назва компанії має містити мінімум 5 символів!' });
  }

  try {
    await db.collection('startups').doc('my-company').set({
      name: name,
      description: description,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true }); 
    
    res.json({ message: 'Інформацію про компанію успішно оновлено!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер успішно запущено на порту ${PORT}`);
});