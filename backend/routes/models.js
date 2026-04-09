const express = require('express');
const { query } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// ===== GET TODOS LOS MODELOS (ADMIN) =====
// Admin ve TODOS los modelos; usuarios normales ven solo los suyos
router.get('/', verifyToken, async (req, res) => {
    try {
        let result;
        if (req.isAdmin) {
            // Admin: todos los modelos
            result = await query(
                `SELECT id, nombre, ubicacion, descripcion, servicios,
                        foto, en_linea, telefono, whatsapp,
                        info_servicios, horario, lugar, precio, certificada, created_at
                 FROM models
                 ORDER BY created_at DESC`
            );
        } else {
            // Usuario normal: solo los suyos
            result = await query(
                `SELECT id, nombre, ubicacion, descripcion, servicios,
                        foto, en_linea, telefono, whatsapp, created_at
                 FROM models
                 WHERE user_id = $1
                 ORDER BY created_at DESC`,
                [req.userId]
            );
        }

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
                    foto, en_linea, telefono, whatsapp,
                    info_servicios, horario, lugar, precio, certificada, created_at
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
        let result;
        if (req.isAdmin) {
            // Admin puede ver cualquier modelo
            result = await query(
                `SELECT id, nombre, ubicacion, descripcion, servicios,
                        foto, en_linea, telefono, whatsapp,
                        info_servicios, horario, lugar, precio, certificada, created_at
                 FROM models
                 WHERE id = $1`,
                [id]
            );
        } else {
            result = await query(
                `SELECT id, nombre, ubicacion, descripcion, servicios,
                        foto, en_linea, telefono, whatsapp,
                        info_servicios, horario, lugar, precio, certificada, created_at
                 FROM models
                 WHERE id = $1 AND user_id = $2`,
                [id, req.userId]
            );
        }

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
    const { nombre, ubicacion, descripcion, servicios, foto, en_linea, telefono, whatsapp,
            info_servicios, horario, lugar, precio, certificada } = req.body;

    // Validación
    if (!nombre || !nombre.trim()) {
        return res.status(400).json({ error: 'El nombre es requerido' });
    }
    if (!ubicacion) {
        return res.status(400).json({ error: 'La ubicación es requerida' });
    }
    if (!telefono || !telefono.trim()) {
        return res.status(400).json({ error: 'El teléfono es requerido' });
    }

    try {
        const result = await query(
            `INSERT INTO models (user_id, nombre, ubicacion, descripcion, servicios, foto, en_linea, telefono, whatsapp,
                                 info_servicios, horario, lugar, precio, certificada)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
             RETURNING id, nombre, ubicacion, descripcion, servicios, foto, en_linea, telefono, whatsapp,
                       info_servicios, horario, lugar, precio, certificada, created_at`,
            [
                req.userId,
                nombre.trim(),
                ubicacion,
                descripcion || '',
                JSON.stringify(Array.isArray(servicios) ? servicios : []),
                foto || null,
                en_linea === true || en_linea === 'true' || false,
                telefono.trim(),
                (whatsapp || telefono).trim(),
                info_servicios || 'Consultar',
                horario || '24 Horas',
                lugar || 'Lugar propio, Hoteles, Moteles y Domicilios',
                precio || 'Consultar',
                certificada === true || certificada === 'true' || false
            ]
        );

        const model = result.rows[0];
        if (typeof model.servicios === 'string') {
            model.servicios = JSON.parse(model.servicios);
        }

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
// Admin puede actualizar CUALQUIER modelo; usuario normal solo los suyos
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { nombre, ubicacion, descripcion, servicios, foto, en_linea, telefono, whatsapp,
            info_servicios, horario, lugar, precio, certificada } = req.body;

    try {
        // Verificar que el modelo existe
        const modelCheck = await query(
            'SELECT id, user_id FROM models WHERE id = $1',
            [id]
        );

        if (modelCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Modelo no encontrado' });
        }

        // Si no es admin, verificar ownership
        if (!req.isAdmin && modelCheck.rows[0].user_id !== req.userId) {
            return res.status(403).json({ error: 'No tienes permiso para actualizar este modelo' });
        }

        // Construir query de actualización
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
                 info_servicios = COALESCE($10, info_servicios),
                 horario = COALESCE($11, horario),
                 lugar = COALESCE($12, lugar),
                 precio = COALESCE($13, precio),
                 certificada = COALESCE($14, certificada),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $9
             RETURNING id, nombre, ubicacion, descripcion, servicios, foto, en_linea, telefono, whatsapp,
                       info_servicios, horario, lugar, precio, certificada, updated_at`,
            [
                nombre ? nombre.trim() : null,
                ubicacion || null,
                descripcion !== undefined ? descripcion : null,
                servicios !== undefined ? JSON.stringify(Array.isArray(servicios) ? servicios : []) : null,
                foto !== undefined ? foto : null,
                en_linea !== undefined ? (en_linea === true || en_linea === 'true') : null,
                telefono ? telefono.trim() : null,
                whatsapp ? whatsapp.trim() : null,
                id,
                info_servicios !== undefined ? info_servicios : null,
                horario !== undefined ? horario : null,
                lugar !== undefined ? lugar : null,
                precio !== undefined ? precio : null,
                certificada !== undefined ? (certificada === true || certificada === 'true') : null
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Modelo no encontrado' });
        }

        const model = result.rows[0];
        if (typeof model.servicios === 'string') {
            model.servicios = JSON.parse(model.servicios);
        }

        res.json({
            message: 'Modelo actualizado exitosamente',
            model
        });
    } catch (err) {
        console.error('Error actualizando modelo:', err);
        res.status(500).json({ error: 'Error al actualizar modelo: ' + err.message });
    }
});

// ===== TOGGLE EN LINEA (RUTA RÁPIDA PARA ADMIN) =====
router.patch('/:id/toggle-online', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const modelCheck = await query('SELECT id, en_linea, user_id FROM models WHERE id = $1', [id]);

        if (modelCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Modelo no encontrado' });
        }

        if (!req.isAdmin && modelCheck.rows[0].user_id !== req.userId) {
            return res.status(403).json({ error: 'No tienes permiso' });
        }

        const newStatus = !modelCheck.rows[0].en_linea;

        await query(
            'UPDATE models SET en_linea = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [newStatus, id]
        );

        res.json({ message: 'Estado actualizado', en_linea: newStatus });
    } catch (err) {
        console.error('Error toggling status:', err);
        res.status(500).json({ error: 'Error al cambiar estado' });
    }
});

// ===== ELIMINAR MODELO =====
// Admin puede eliminar CUALQUIER modelo; usuario normal solo los suyos
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar que el modelo existe
        const modelCheck = await query(
            'SELECT id, user_id FROM models WHERE id = $1',
            [id]
        );

        if (modelCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Modelo no encontrado' });
        }

        // Si no es admin, verificar ownership
        if (!req.isAdmin && modelCheck.rows[0].user_id !== req.userId) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar este modelo' });
        }

        await query('DELETE FROM models WHERE id = $1', [id]);

        res.json({ message: 'Modelo eliminado exitosamente' });
    } catch (err) {
        console.error('Error eliminando modelo:', err);
        res.status(500).json({ error: 'Error al eliminar modelo' });
    }
});

module.exports = router;
