const { Pool } = require('pg');
require('dotenv').config();

// Crear pool de conexiones
const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    })
    : new Pool({
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'spatagonia'
    });

// Evento de conexión
pool.on('connect', () => {
    console.log('✓ Conectado a PostgreSQL');
});

// Evento de error
pool.on('error', (err) => {
    console.error('Error en el pool de conexiones:', err);
});

// Función para ejecutar queries
const query = (text, params) => pool.query(text, params);

// Función para inicializar tablas
const initializeTables = async () => {
    try {
        // Crear tabla users
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                is_admin BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Migración: agregar columna is_admin si no existe (para DBs existentes)
        await pool.query(`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
        `);
        console.log('✓ Tabla users lista');

        // Marcar automáticamente al admin email como is_admin = true
        const adminEmail = process.env.ADMIN_EMAIL || 'cierpeh@gmail.com';
        await pool.query(`
            UPDATE users SET is_admin = true WHERE email = $1;
        `, [adminEmail]);

        // Crear tabla models
        await pool.query(`
            CREATE TABLE IF NOT EXISTS models (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                nombre VARCHAR(255) NOT NULL,
                ubicacion VARCHAR(255),
                descripcion TEXT,
                servicios JSONB DEFAULT '[]'::jsonb,
                foto TEXT,
                en_linea BOOLEAN DEFAULT false,
                telefono VARCHAR(20),
                whatsapp VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✓ Tabla models lista');

        // Crear índices
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_models_user_id ON models(user_id);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_models_ubicacion ON models(ubicacion);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_models_en_linea ON models(en_linea);`);
        console.log('✓ Índices creados');

    } catch (err) {
        console.error('Error al crear tablas:', err);
        throw err;
    }
};

module.exports = {
    pool,
    query,
    initializeTables
};
