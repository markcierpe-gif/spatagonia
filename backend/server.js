const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initializeTables } = require('./config/db');
const authRoutes = require('./routes/auth');
const modelsRoutes = require('./routes/models');

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8000';

// ===== MIDDLEWARE =====
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Servir archivos estáticos (imágenes)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Servir frontend (archivos HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '..')));

// CORS configurado - permite cualquier origen para desarrollo
app.use(cors({
    origin: '*', // En producción, cambiar a tu dominio real
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false
}));

// ===== RUTAS =====
app.use('/api/auth', authRoutes);
app.use('/api/models', modelsRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// ===== INICIAR SERVIDOR =====
const startServer = async () => {
    try {
        // Inicializar tablas
        await initializeTables();

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`\n✓ Servidor corriendo en http://localhost:${PORT}`);
            console.log(`✓ Frontend: ${FRONTEND_URL}`);
            console.log(`✓ Node env: ${process.env.NODE_ENV || 'development'}\n`);
        });
    } catch (err) {
        console.error('Error al iniciar servidor:', err);
        process.exit(1);
    }
};

startServer();

module.exports = app;
