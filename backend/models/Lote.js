const mongoose = require('mongoose');

const LoteSchema = new mongoose.Schema({
  // Campos del Lote
  kilos: { type: Number, required: true },
  num_de_cajas: { type: Number, required: true },
  precio_kilo_salida: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },

  especie: {
    nombre: { type: String, required: true },
    id_tpo: { type: String, required: true }, 
    imagen: { type: String } 
  }
});

LoteSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id_lte = ret._id; 
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Lote', LoteSchema);