const express = require('express');
const router = express.Router();
const Lote = require('../models/Lote');

// --- RUTA 1: OBTENER TODOS (GET) ---
// Esta es la que usa tu página al cargar. Solo lee de la base de datos.
router.get('/', async (req, res) => {
  try {
    const lotes = await Lote.find().sort({ fecha: -1 });
    res.json(lotes);
  } catch (err) {
    console.error("Error en GET /inventory:", err); // Log para ver el error en Render
    res.status(500).json({ message: err.message });
  }
});

// --- RUTA 2: CREAR NUEVO (POST) ---
// Esta solo se usa cuando le das a "Guardar" en el formulario.
router.post('/', async (req, res) => {
  try {
    // Validamos que vengan los datos mínimos
    if (!req.body.especie) {
      return res.status(400).json({ message: "Faltan datos de la especie" });
    }

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

    const guardado = await nuevoLote.save();
    res.status(201).json(guardado);
  } catch (err) {
    console.error("Error en POST /inventory:", err);
    res.status(400).json({ message: err.message });
  }
});

// --- RUTA 3: ELIMINAR (DELETE) ---
router.delete('/:id', async (req, res) => {
  try {
    await Lote.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lote eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- RUTA 4: ACTUALIZAR (PUT) ---
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

module.exports = router;