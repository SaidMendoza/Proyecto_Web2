const express = require('express');
const router = express.Router();
const Lote = require('../models/Lote');

// OBTENER TODOS
router.get('/', async (req, res) => {
  try {
    const lotes = await Lote.find().sort({ fecha: -1 }); 
    res.json(lotes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREAR NUEVO
router.post('/', async (req, res) => {
  const { kilos, numero_cajas, precio_kilo_salida, fecha, especie } = req.body;

  const nuevoLote = new Lote({
    kilos,
    numero_cajas,
    precio_kilo_salida,
    fecha: fecha || new Date(),
    especie: {
      nombre: especie.nombre,
      id_tpo: especie.id_tpo,
      imagen: especie.imagen
    }
  });

  try {
    const guardado = await nuevoLote.save();
    res.status(201).json(guardado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ACTUALIZAR
router.put('/:id', async (req, res) => {
  try {
    const loteActualizado = await Lote.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } 
    );
    res.json(loteActualizado);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ELIMINAR 
router.delete('/:id', async (req, res) => {
  try {
    await Lote.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lote eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;