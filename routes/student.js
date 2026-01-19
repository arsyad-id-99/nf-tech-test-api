const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const auth = require('../middleware/authMiddleware');

// 1. Add Student
router.post('/', auth, async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// 2. Get List (Pagination, Search by Nama/NISN, Filter by Jurusan)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, jurusan } = req.query;
    let query = {};

    // 1. Logika Search (Nama Lengkap ATAU NISN)
    if (search) {
      query.$or = [
        { namaLengkap: { $regex: search, $options: 'i' } }, // 'i' artinya case-insensitive
        { nisn: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Logika Filter (Jurusan)
    if (jurusan) {
      query.jurusan = jurusan;
    }

    // Eksekusi Query
    const data = await Siswa.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }); // Urutkan dari yang terbaru

    // Menghitung total data untuk pagination
    const count = await Siswa.countDocuments(query);

    res.json({
      success: true,
      data,
      pagination: {
        totalData: count,
        totalPage: Math.ceil(count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Get List Jurusan (Static dari Enum)
router.get('/jurusan', (req, res) => {
  try {
    // Daftar jurusan sesuai dengan Enum di Model Siswa
    const listJurusan = ['IPA', 'IPS', 'Bahasa'];
    
    res.json({
      success: true,
      data: listJurusan
    });
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data jurusan" });
  }
});

// 4. Get Detail
router.get('/:id', auth, async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ msg: "Siswa tidak ditemukan" });
  res.json(student);
});

module.exports = router;
