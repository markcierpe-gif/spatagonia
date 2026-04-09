const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const router = express.Router();

// ===== REGISTRO =====
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Validación
    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Contraseña debe tener al menos 6 caracteres' });
    }

    try {
        // Verificar si usuario existe
        const userExists = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email ya registrado' });
        }

        // Hash contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear usuario
        const result = await query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
            [email, passwordHash]
        );

        const user = result.rows[0];

        // Generar JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (err) {
        console.error('Error en registro:', err);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// ===== LOGIN =====
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validación
    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    try {
        // Buscar usuario
        const result = await query(
            'SELECT id, email, password_hash FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = result.rows[0];

        // Verificar contraseña
        const passwordValid = await bcrypt.compare(password, user.password_hash);
        if (!passwordValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '30d' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// ===== VERIFY TOKEN =====
router.post('/verify', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ valid: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        res.json({ valid: true, user: decoded });
    } catch (err) {
        res.status(401).json({ valid: false });
    }
});

module.exports = router;
