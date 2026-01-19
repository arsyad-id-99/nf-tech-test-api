const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.json({ msg: "User berhasil dibuat" });
});

router.post('/login', async (req, res) => {
  const { username, password, deviceToken } = req.body; // Terima deviceToken dari body
  const user = await User.findOne({ username });
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: "Kredensial salah" });
  }

  // Update deviceToken terbaru milik user
  if (deviceToken) {
    user.deviceToken = deviceToken;
    await user.save();
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { username: user.username, deviceToken: user.deviceToken } });
});

module.exports = router;
