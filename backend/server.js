// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Permite que tu Frontend (React) hable con el Backend
app.use(express.json()); // Permite recibir datos JSON

// Conexión a MongoDB Atlas
// (Más abajo te digo qué poner en el archivo .env)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch((err) => console.error('❌ Error de conexión:', err));

// Rutas de prueba
app.get('/', (req, res) => {
    res.send('API de Sist-Lonja funcionando 🚀');
});

// Importar rutas (Las crearemos en el siguiente paso)
const inventoryRoutes = require('./routes/inventory');
const buyerRoutes = require('./routes/buyers');
const userRoutes = require('./routes/users');
const salesRoutes = require('./routes/sales');
const authRoutes = require('./routes/auth'); // <--- NUEVO IMPORT
app.use('/api/inventory', inventoryRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/auth', authRoutes); // <--- NUEVA RUTA

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});