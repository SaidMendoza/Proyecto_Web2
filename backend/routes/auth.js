const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Buscamos el usuario en MongoDB
    const user = await User.findOne({ username });

    // 2. Verificamos si existe y si la contraseña coincide
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // 3. Si todo está bien, devolvemos los datos del usuario (¡Incluyendo el ROL!)
    // Ojo: No devolvemos la contraseña por seguridad
    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role // <--- ESTO ES LA CLAVE
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;