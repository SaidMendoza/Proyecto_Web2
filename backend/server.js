const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch((err) => console.error('Error de conexión:', err));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Sist-Lonja funcionando ');
});

// Importar rutas
const inventoryRoutes = require('./routes/inventory');
const buyerRoutes = require('./routes/buyers');
const userRoutes = require('./routes/users');
const salesRoutes = require('./routes/sales');
const authRoutes = require('./routes/auth'); 
app.use('/api/inventory', inventoryRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});