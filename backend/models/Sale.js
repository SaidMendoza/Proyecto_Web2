const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  comprador: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true },
  lote: { type: mongoose.Schema.Types.ObjectId, ref: 'Lote', required: true },
  
  precio_kilo_final: { type: Number, required: true },
  precio_total: { type: Number, required: true },
  kilos_vendidos: { type: Number, required: true },
  cajas_vendidas: { type: Number, default: 0 },
  
  fecha: { type: Date, default: Date.now }
});

// Transformación para que el frontend reciba "id_cmp" y no se rompa
SaleSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id_cmp = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Sale', SaleSchema);