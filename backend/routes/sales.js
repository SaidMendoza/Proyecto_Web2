const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Lote = require('../models/Lote');

// OBTENER REPORTE (Con filtro por fecha)
router.get('/report', async (req, res) => {
  const { date } = req.query; // Esperamos formato YYYY-MM-DD
  
  try {
    // Buscamos ventas que coincidan con la fecha (ignorando la hora exactas)
    const startDate = new Date(date);
    startDate.setUTCHours(0,0,0,0);
    const endDate = new Date(date);
    endDate.setUTCHours(23,59,59,999);

    const sales = await Sale.find({
      fecha: { $gte: startDate, $lte: endDate }
    })
    .populate('comprador') // Trae los datos del comprador
    .populate('lote');     // Trae los datos del lote

    // Ajustamos los datos para que tu DashboardView.jsx no falle
    const reportData = sales.map(sale => {
      const s = sale.toObject();
      // Tu vista espera "v.especie", pero eso está dentro del lote. Lo sacamos fuera:
      s.especie = s.lote ? s.lote.especie : { nombre: 'Lote Eliminado' };
      return s;
    });

    res.json(reportData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREAR VENTA (Y descontar inventario)
router.post('/', async (req, res) => {
  const { codigo_cpr, id_lte, kilos_vendidos, cajas_vendidas, precio_kilo_final, precio_total, fecha } = req.body;

  try {
    // 1. Buscamos el Lote para ver si hay stock
    const lote = await Lote.findById(id_lte);
    if (!lote) return res.status(404).json({ message: 'Lote no encontrado' });

    if (lote.kilos < kilos_vendidos) {
      return res.status(400).json({ message: `Stock insuficiente. Solo quedan ${lote.kilos}kg` });
    }

    // 2. Descontamos el stock
    lote.kilos -= kilos_vendidos;
    lote.numero_cajas -= cajas_vendidas; // Opcional, si quieres control estricto de cajas
    await lote.save();

    // 3. Creamos la Venta
    const newSale = new Sale({
      comprador: codigo_cpr,
      lote: id_lte,
      kilos_vendidos,
      cajas_vendidas,
      precio_kilo_final,
      precio_total,
      fecha: fecha || new Date()
    });

    const savedSale = await newSale.save();
    res.status(201).json(savedSale);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ACTUALIZAR VENTA (Corrección de errores)
router.put('/:id', async (req, res) => {
    // Esta lógica es compleja porque implica devolver stock y restar de nuevo.
    // Por simplicidad en este tutorial, solo actualizaremos datos básicos.
    try {
        const updated = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;