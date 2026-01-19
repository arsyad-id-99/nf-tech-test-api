const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  deviceToken: { type: String, default: null } // Tambahkan ini
});
module.exports = mongoose.model('User', UserSchema);
