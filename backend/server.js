const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Verificar JWT_SECRET en producción
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    console.error('FATAL: JWT_SECRET no configurado');
    process.exit(1);
}

const { initializeTables, query } = require('./config/db');
const authRoutes = require('./routes/auth');
const modelsRoutes = require('./routes/models');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(helmet({
    contentSecurityPolicy: false,  // El sitio usa scripts/styles inline
    crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb' }));

// Headers de seguridad y SEO
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// CORS
const siteUrl = process.env.SITE_URL || 'https://spatagonia.onrender.com';
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [siteUrl]
    : ['http://localhost:8000', 'http://localhost:5000', 'http://127.0.0.1:8000'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Rate limiting para auth
const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { error: 'Demasiados intentos. Espera 1 minuto.' }
});

// ===== SSR: Renderizar index.html con perfiles pre-cargados =====
app.get('/', async (req, res) => {
    try {
        const htmlPath = path.join(__dirname, '..', 'index.html');
        let html = fs.readFileSync(htmlPath, 'utf8');

        // Obtener modelos de la DB
        const result = await query(
            `SELECT id, nombre, ubicacion, descripcion, servicios, foto, en_linea, telefono, whatsapp
             FROM models ORDER BY created_at DESC`
        );
        const models = result.rows;

        // Generar HTML de las cards
        let cardsHtml = '';
        models.forEach(model => {
            const servicios = Array.isArray(model.servicios) ? model.servicios : [];
            const imageUrl = model.foto || '';
            const imageHtml = imageUrl ? `<img src="${imageUrl}" alt="Foto de ${model.nombre}, escort en ${model.ubicacion}" style="width:100%;height:100%;object-fit:cover;" loading="lazy">` : '';
            const videoBadge = servicios.includes('Video Call') ? '<span class="video-badge">📹</span>' : '';

            cardsHtml += `
            <article class="profile-card" data-id="${model.id}" data-ubicacion="${model.ubicacion}">
                <div class="profile-image">
                    ${imageHtml}
                    ${videoBadge}
                    <span class="online-indicator ${model.en_linea ? 'active' : 'inactive'}"></span>
                </div>
                <div class="profile-info">
                    <h3 class="profile-name">${model.nombre}</h3>
                    <p class="profile-description">${model.descripcion}</p>
                    <div class="profile-location">
                        <span>📍 ${model.ubicacion}</span>
                    </div>
                </div>
            </article>`;
        });

        // Inyectar cards en el HTML
        html = html.replace(
            '<!-- Tarjetas generadas por JavaScript -->',
            cardsHtml
        );

        res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
        res.send(html);
    } catch (err) {
        console.error('Error SSR:', err);
        // Fallback: servir HTML estático sin SSR
        res.sendFile(path.join(__dirname, '..', 'index.html'));
    }
});

// ===== SITEMAP DINÁMICO =====
app.get('/sitemap.xml', async (req, res) => {
    try {
        const result = await query('SELECT DISTINCT ubicacion FROM models');
        const ubicaciones = result.rows.map(r => r.ubicacion);
        const now = new Date().toISOString().split('T')[0];

        const baseUrl = process.env.SITE_URL || 'https://spatagonia.onrender.com';
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

        ubicaciones.forEach(ub => {
            xml += `
  <url>
    <loc>${baseUrl}/?ubicacion=${encodeURIComponent(ub)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
        });

        xml += '\n</urlset>';

        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.send(xml);
    } catch (err) {
        res.setHeader('Content-Type', 'application/xml');
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://spatagonia.onrender.com/</loc><priority>1.0</priority></url>
</urlset>`);
    }
});

// Servir archivos estáticos con cache
app.use('/images', express.static(path.join(__dirname, 'public/images'), { maxAge: '7d' }));
app.use(express.static(path.join(__dirname, '..'), { maxAge: '1h' }));

// ===== RUTAS API =====
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
        const bcrypt = require('bcryptjs');

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS || 'Marco1981@', 10);
        const adminEmail = process.env.ADMIN_EMAIL || 'cierpeh@gmail.com';

        let userResult = await query('SELECT id FROM users WHERE email = $1', [adminEmail]);
        let userId;
        if (userResult.rows.length === 0) {
            userResult = await query('INSERT INTO users (email, password_hash, is_admin) VALUES ($1, $2, true) RETURNING id', [adminEmail, hashedPassword]);
            userId = userResult.rows[0].id;
        } else {
            userId = userResult.rows[0].id;
            // Asegurar que el usuario admin tenga is_admin = true
            await query('UPDATE users SET is_admin = true WHERE id = $1', [userId]);
        }

        await query('DELETE FROM models');

        const fotoUrl = '/images/modelo-400x500.jpg';

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

// ===== ERROR HANDLERS =====
app.use((req, res) => {
    res.status(404).json({ error: 'Not found', path: req.path });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({ error: err.message });
});

// ===== INICIAR SERVIDOR =====
const startServer = async () => {
    // Arrancar HTTP primero para que Railway/Render detecte el puerto
    app.listen(PORT, () => {
        console.log(`\n✓ Servidor corriendo en puerto ${PORT}`);
        console.log(`✓ Node env: ${process.env.NODE_ENV || 'development'}\n`);
    });

    // Intentar conectar a la DB con reintentos
    let intentos = 0;
    const maxIntentos = 5;
    while (intentos < maxIntentos) {
        try {
            await initializeTables();
            console.log('✓ Base de datos conectada');
            break;
        } catch (err) {
            intentos++;
            console.error(`Error DB (intento ${intentos}/${maxIntentos}):`, err.message);
            if (intentos >= maxIntentos) {
                console.error('No se pudo conectar a la base de datos. El servidor sigue activo.');
            } else {
                await new Promise(r => setTimeout(r, 3000)); // esperar 3 segundos antes de reintentar
            }
        }
    }
};

startServer();

module.exports = app;
