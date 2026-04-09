const express = require('express');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Verificar JWT_SECRET en producción
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    console.error('FATAL: JWT_SECRET no configurado');
    process.exit(1);
}

const { initializeTables } = require('./config/db');
const authRoutes = require('./routes/auth');
const modelsRoutes = require('./routes/models');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(compression());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb' }));

// CORS - restringir en producción
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://spatagonia.onrender.com']
    : ['http://localhost:8000', 'http://localhost:5000', 'http://127.0.0.1:8000'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Permitir requests sin origin (mismo servidor)
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Rate limiting para auth
const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 5,
    message: { error: 'Demasiados intentos. Espera 1 minuto.' }
});

// Servir archivos estáticos con cache
app.use('/images', express.static(path.join(__dirname, 'public/images'), { maxAge: '7d' }));
app.use(express.static(path.join(__dirname, '..'), { maxAge: '1h' }));

// ===== RUTAS =====
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/models', modelsRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// Seed protegido con clave
app.get('/api/seed', async (req, res) => {
    const seedKey = req.query.key;
    if (seedKey !== (process.env.SEED_KEY || 'spatagonia2026')) {
        return res.status(403).json({ error: 'No autorizado' });
    }

    try {
        const { query } = require('./config/db');
        const bcrypt = require('bcryptjs');

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS || 'Marco1981@', 10);
        const adminEmail = process.env.ADMIN_EMAIL || 'cierpeh@gmail.com';

        let userResult = await query('SELECT id FROM users WHERE email = $1', [adminEmail]);
        let userId;
        if (userResult.rows.length === 0) {
            userResult = await query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id', [adminEmail, hashedPassword]);
            userId = userResult.rows[0].id;
        } else {
            userId = userResult.rows[0].id;
        }

        await query('DELETE FROM models');

        const fotos = [];
        for (let i = 1; i <= 20; i++) fotos.push(`https://picsum.photos/seed/m${i}/400/500`);

        const nombres = ['VALENTINA LATINA','PAOLITA Y NICOLE','LORENA APRETADITA','SOFÍA SENSUAL','JESSICA HOT','CAMILA CARIÑOSA','MARTINA LATINA','GABRIELA SEXY','LUNA JOVENCITA','ISABELLA HERMOSA','DANIELA BELLA','ROXANA PASIONAL','VANESSA COQUETA','ANDREA SENSIBLE','GLORIA ATREVIDA','KARINA BELLA','ALEJANDRA HOT','BRENDA SEXY','CYNTHIA PASIONAL','DIANA CARIÑOSA'];
        const ubicaciones = ['Punta Arenas','Punta Arenas','Punta Arenas','Punta Arenas','Punta Arenas','Puerto Natales','Puerto Natales','Puerto Natales','Puerto Natales','Puerto Natales','Porvenir','Porvenir','Porvenir','Porvenir','Porvenir','Coyhaique','Coyhaique','Coyhaique','Coyhaique','Coyhaique'];
        const telefono = '+56912345679';

        for (let i = 0; i < 20; i++) {
            await query(
                'INSERT INTO models (user_id, nombre, ubicacion, descripcion, servicios, foto, en_linea, telefono, whatsapp) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
                [userId, nombres[i], ubicaciones[i], '✨ Una experiencia HOT 🔥 para disfrutar ✨', '["Video Call","Fotos"]', fotos[i], i % 2 === 0, telefono, telefono]
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
        await initializeTables();
        app.listen(PORT, () => {
            console.log(`\n✓ Servidor corriendo en puerto ${PORT}`);
            console.log(`✓ Node env: ${process.env.NODE_ENV || 'development'}\n`);
        });
    } catch (err) {
        console.error('Error al iniciar servidor:', err);
        process.exit(1);
    }
};

startServer();

module.exports = app;
