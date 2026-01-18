const mongoose = require('mongoose');
const SiswaSchema = new mongoose.Schema({
  namaLengkap: { type: String, required: true },
  nisn: { type: String, required: true, unique: true },
  tanggalLahir: { type: Date, required: true },
  jurusan: { type: String, enum: ['ipa', 'ips', 'bahasa'], required: true }
}, { timestamps: true });
module.exports = mongoose.model('Siswa', SiswaSchema);
