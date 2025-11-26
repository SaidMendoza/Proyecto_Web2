const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // En producción deberíamos encriptarla
  name: { type: String, required: true },
  role: { type: String, default: 'user' } // 'admin' o 'user'
});

// Mapeamos _id a id para el frontend
UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', UserSchema);