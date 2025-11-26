const express = require('express');
const router = express.Router();
const User = require('../models/User');

// OBTENER TODOS
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREAR USUARIO
router.post('/', async (req, res) => {
  // Aquí podrías validar si la contraseña del admin es correcta, 
  // pero por simplicidad lo crearemos directo.
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    role: req.body.role
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ELIMINAR
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;