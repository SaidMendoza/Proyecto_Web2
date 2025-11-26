const express = require('express');
const router = express.Router();
const Buyer = require('../models/Buyer');

// OBTENER TODOS
router.get('/', async (req, res) => {
  try {
    const buyers = await Buyer.find();
    res.json(buyers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREAR NUEVO
router.post('/', async (req, res) => {
  const buyer = new Buyer({
    nombre: req.body.nombre,
    apellido_paterno: req.body.apellido_paterno,
    apellido_materno: req.body.apellido_materno,
    correo: req.body.correo,
    direccion: req.body.direccion
  });

  try {
    const newBuyer = await buyer.save();
    res.status(201).json(newBuyer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ELIMINAR
router.delete('/:id', async (req, res) => {
  try {
    await Buyer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comprador eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// EDITAR
router.put('/:id', async (req, res) => {
  try {
    const updated = await Buyer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;