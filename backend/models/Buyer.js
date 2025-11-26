const mongoose = require('mongoose');

const BuyerSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido_paterno: { type: String, required: true },
  apellido_materno: { type: String },
  correo: { type: String, required: true },
  direccion: { type: String, required: true },
  fechaRegistro: { type: Date, default: Date.now }
});

// Truco para que el Frontend no se rompa: convertimos _id a codigo_cpr
BuyerSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.codigo_cpr = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Buyer', BuyerSchema);