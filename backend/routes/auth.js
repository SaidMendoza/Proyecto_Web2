const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscamos el usuario en MongoDB
    const user = await User.findOne({ username });

    // Verificamos si existe y si la contraseña coincide
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Si todo está bien, devolvemos los datos del usuario
    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;