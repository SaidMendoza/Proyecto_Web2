// backend/models/Lote.js
const mongoose = require('mongoose');

const LoteSchema = new mongoose.Schema({
  // Datos del Lote
  kilos: { type: Number, required: true },
  numero_cajas: { type: Number, required: true },
  precio_kilo_salida: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },

  // Datos de la Especie (Incrustados directamente)
  especie: {
    nombre: { type: String, required: true },
    id_tpo: { type: String, required: true }, // ID del tipo (1 o 2)
    imagen: { type: String }
  }
});

// Esto es un truco para que el frontend no se rompa:
// Cuando convierta a JSON, transformará el "_id" de Mongo a "id_lte"
LoteSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id_lte = ret._id; // Mapeamos _id a id_lte
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Lote', LoteSchema);