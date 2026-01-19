const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/student', require('./routes/student'));

// Koneksi Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Berhasil Terhubung ke MongoDB'))
  .catch(err => {
    console.error('❌ Gagal Koneksi Database:');
    console.error(err.message);
  });

// Route Dummy
app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
