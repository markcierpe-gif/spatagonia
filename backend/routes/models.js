const express = require('express');
const { query } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// ===== GET TODOS LOS MODELOS =====
router.get('/', verifyToken, async (req, res) => {
    try {
        const result = await query(
            `SELECT id, nombre, ubicacion, descripcion, servicios,
                    foto, en_linea, telefono, whatsapp, created_at
             FROM models
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [req.userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Error obteniendo modelos:', err);
        res.status(500).json({ error: 'Error al obtener modelos' });
    }
});

// ===== GET TODOS LOS MODELOS (PUBLICO - para ver en el sitio) =====
router.get('/public/all', async (req, res) => {
    try {
        const result = await query(
            `SELECT id, nombre, ubicacion, descripcion, servicios,
                    foto, en_linea, telefono, whatsapp, created_at
             FROM models
             ORDER BY created_at DESC`
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Error obteniendo modelos públicos:', err);
        res.status(500).json({ error: 'Error al obtener modelos' });
    }
});

// ===== GET UN MODELO =====
router.get('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await query(
            `SELECT id, nombre, ubicacion, descripcion, servicios,
                    foto, en_linea, telefono, whatsapp, created_at
             FROM models
             WHERE id = $1 AND user_id = $2`,
            [id, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Modelo no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error obteniendo modelo:', err);
        res.status(500).json({ error: 'Error al obtener modelo' });
    }
});

// ===== CREAR MODELO =====
router.post('/', verifyToken, async (req, res) => {
    const { nombre, ubicacion, descripcion, servicios, foto, en_linea, telefono, whatsapp } = req.body;

    // Validación
    if (!nombre || !ubicacion || !telefono) {
        return res.status(400).json({ error: 'Nombre, ubicación y teléfono son requeridos' });
    }

    try {
        const result = await query(
            `INSERT INTO models (user_id, nombre, ubicacion, descripcion, servicios, foto, en_linea, telefono, whatsapp)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id, nombre, ubicacion, descripcion, servicios, foto, en_linea, telefono, whatsapp, created_at`,
            [
                req.userId,
                nombre,
                ubicacion,
                descripcion || '',
                JSON.stringify(servicios || []),
                foto || null,
                en_linea || false,
                telefono,
                whatsapp || telefono
            ]
        );

        const model = result.rows[0];
        model.servicios = JSON.parse(model.servicios);

        res.status(201).json({
            message: 'Modelo creado exitosamente',
            model
        });
    } catch (err) {
        console.error('Error creando modelo:', err);
        res.status(500).json({ error: 'Error al crear modelo' });
    }
});

// ===== ACTUALIZAR MODELO =====
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { nombre, ubicacion, descripcion, servicios, foto, en_linea, telefono, whatsapp } = req.body;

    try {
        // Verificar que el modelo pertenece al usuario
        const modelCheck = await query(
            'SELECT user_id FROM models WHERE id = $1',
            [id]
        );

        if (modelCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Modelo no encontrado' });
        }

        if (modelCheck.rows[0].user_id !== req.userId) {
            return res.status(403).json({ error: 'No tienes permiso para actualizar este modelo' });
        }

        // Actualizar
        const result = await query(
            `UPDATE models
             SET nombre = COALESCE($1, nombre),
                 ubicacion = COALESCE($2, ubicacion),
                 descripcion = COALESCE($3, descripcion),
                 servicios = COALESCE($4, servicios),
                 foto = COALESCE($5, foto),
                 en_linea = COALESCE($6, en_linea),
                 telefono = COALESCE($7, telefono),
                 whatsapp = COALESCE($8, whatsapp),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $9 AND user_id = $10
             RETURNING id, nombre, ubicacion, descripcion, servicios, foto, en_linea, telefono, whatsapp, updated_at`,
            [
                nombre || null,
                ubicacion || null,
                descripcion || null,
                servicios ? JSON.stringify(servicios) : null,
                foto || null,
                en_linea !== undefined ? en_linea : null,
                telefono || null,
                whatsapp || null,
                id,
                req.userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Modelo no encontrado' });
        }

        const model = result.rows[0];
        model.servicios = JSON.parse(model.servicios);

        res.json({
            message: 'Modelo actualizado exitosamente',
            model
        });
    } catch (err) {
        console.error('Error actualizando modelo:', err);
        res.status(500).json({ error: 'Error al actualizar modelo' });
    }
});

// ===== ELIMINAR MODELO =====
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar que el modelo pertenece al usuario
        const modelCheck = await query(
            'SELECT user_id FROM models WHERE id = $1',
            [id]
        );

        if (modelCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Modelo no encontrado' });
        }

        if (modelCheck.rows[0].user_id !== req.userId) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar este modelo' });
        }

        // Eliminar
        await query(
            'DELETE FROM models WHERE id = $1 AND user_id = $2',
            [id, req.userId]
        );

        res.json({ message: 'Modelo eliminado exitosamente' });
    } catch (err) {
        console.error('Error eliminando modelo:', err);
        res.status(500).json({ error: 'Error al eliminar modelo' });
    }
});

module.exports = router;
