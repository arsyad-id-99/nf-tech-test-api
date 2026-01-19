const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const admin = require('../config/firebase');

// 1. Add Student
router.post('/', auth, async (req, res) => {
  try {
    const { namaLengkap, nisn, tanggalLahir, jurusan } = req.body;

    const nisnTerdaftar = await Student.findOne({ nisn });
    if (nisnTerdaftar) {
      return res.status(400).json({ success: false, message: "NISN sudah terdaftar" });
    }

    const siswaBaru = new Student({ namaLengkap, nisn, tanggalLahir, jurusan });
    await siswaBaru.save();

    const currentUser = await User.findById(req.user.id);

    if (currentUser && currentUser.deviceToken) {
      const message = {
        notification: {
          title: 'Data Siswa Ditambahkan',
          body: `Siswa baru atas nama ${namaLengkap} berhasil disimpan!`
        },
        token: currentUser.deviceToken
      };

      admin.messaging().send(message)
        .then((response) => console.log('Notifikasi terkirim:', response))
        .catch((error) => console.log('Gagal kirim notifikasi:', error));
    }
    // --------------------------------

    res.status(201).json({
      success: true,
      message: "Data siswa berhasil ditambahkan dan notifikasi dikirim",
      data: siswaBaru
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
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
    const data = await Student.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }); // Urutkan dari yang terbaru

    // Menghitung total data untuk pagination
    const count = await Student.countDocuments(query);

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
    // Daftar jurusan sesuai dengan Enum di Model Student
    const listJurusan = ['IPA', 'IPS', 'Bahasa'];
    
    res.json({
      success: true,
      data: listJurusan
    });
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data jurusan" });
  }
});

// 4. Get Detail Siswa berdasarkan NISN
router.get('/:nisn', auth, async (req, res) => {
  try {
    const { nisn } = req.params;

    // Mencari satu data yang memiliki nisn sesuai parameter
    const student = await Student.findOne({ nisn: nisn });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Siswa dengan NISN ${nisn} tidak ditemukan`
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

module.exports = router;
