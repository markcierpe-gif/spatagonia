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

// Seed - crear usuario y 20 modelos (visitar UNA vez)
app.get('/api/seed', async (req, res) => {
    try {
        const { query } = require('./config/db');
        const bcrypt = require('bcryptjs');

        // Crear usuario admin
        const hashedPassword = await bcrypt.hash('Marco1981@', 10);
        let userResult = await query('SELECT id FROM users WHERE email = $1', ['cierpeh@gmail.com']);
        let userId;
        if (userResult.rows.length === 0) {
            userResult = await query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id', ['cierpeh@gmail.com', hashedPassword]);
            userId = userResult.rows[0].id;
        } else {
            userId = userResult.rows[0].id;
        }

        // Limpiar modelos anteriores
        await query('DELETE FROM models');

        const fotoUrl = 'https://via.placeholder.com/400x500.jpg?text=Modelo';
        const nombres = ['VALENTINA LATINA','PAOLITA Y NICOLE','LORENA APRETADITA','SOFÍA SENSUAL','JESSICA HOT','CAMILA CARIÑOSA','MARTINA LATINA','GABRIELA SEXY','LUNA JOVENCITA','ISABELLA HERMOSA','DANIELA BELLA','ROXANA PASIONAL','VANESSA COQUETA','ANDREA SENSIBLE','GLORIA ATREVIDA','KARINA BELLA','ALEJANDRA HOT','BRENDA SEXY','CYNTHIA PASIONAL','DIANA CARIÑOSA'];
        const ubicaciones = ['Punta Arenas','Punta Arenas','Punta Arenas','Punta Arenas','Punta Arenas','Puerto Natales','Puerto Natales','Puerto Natales','Puerto Natales','Puerto Natales','Porvenir','Porvenir','Porvenir','Porvenir','Porvenir','Coyhaique','Coyhaique','Coyhaique','Coyhaique','Coyhaique'];
        const telefono = '+56912345679';

        for (let i = 0; i < 20; i++) {
            await query(
                'INSERT INTO models (user_id, nombre, ubicacion, descripcion, servicios, foto, en_linea, telefono, whatsapp) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
                [userId, nombres[i], ubicaciones[i], '✨ Una experiencia HOT 🔥 para disfrutar ✨', '["Video Call","Fotos"]', fotoUrl, i % 2 === 0, telefono, telefono]
            );
        }

        res.json({ ok: true, message: '20 modelos creados exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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
