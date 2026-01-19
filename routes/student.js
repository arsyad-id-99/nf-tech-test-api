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

// 2. Get List (Pagination, Search, Filter)
router.get('/', auth, async (req, res) => {
  const { page = 1, limit = 10, search, jurusan } = req.query;
  let query = {};

  if (search) query.namaLengkap = { $regex: search, $options: 'i' };
  if (jurusan) query.jurusan = jurusan;

  const data = await Student.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Student.countDocuments(query);
  res.json({ data, totalPage: Math.ceil(count / limit), currentPage: page });
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
