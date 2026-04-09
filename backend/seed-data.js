const fs = require('fs');
const path = require('path');
const { query } = require('./config/db');

// Archivos de fotos disponibles
const photoFiles = [
    'descarga (1).jpg',
    'descarga (2).jpg',
    'descarga (3).jpg',
    'descarga (4).jpg',
    'descarga (5).jpg',
    'descarga.jpg',
    'Femeie modernă.jpg',
    'Instagram model.jpg',
    'Modelo virtual IA con estética clean girl.jpg'
];

const ubicaciones = ['Punta Arenas', 'Puerto Natales', 'Porvenir', 'Coyhaique'];
const servicios = [
    ['Video Call', 'Fotos'],
    ['Video Call'],
    ['Fotos', 'Llamadas'],
    ['Video Call', 'Fotos', 'Llamadas'],
    ['Visita', 'Video Call'],
    ['Fotos'],
    ['Video Call', 'Visita'],
    ['Llamadas', 'Fotos']
];

const nombres = [
    'VALENTINA LATINA',
    'PAOLITA Y NICOLE',
    'LORENA APRETADITA',
    'SOFÍA SENSUAL',
    'JESSICA HOT',
    'CAMILA CARIÑOSA',
    'MARTINA LATINA',
    'GABRIELA SEXY',
    'LUNA JOVENCITA',
    'ISABELLA HERMOSA',
    'DANIELA BELLA',
    'ROXANA PASIONAL',
    'VANESSA COQUETA',
    'ANDREA SENSIBLE',
    'GLORIA ATREVIDA',
    'KARINA BELLA',
    'ALEJANDRA HOT',
    'BRENDA SEXY',
    'CYNTHIA PASIONAL',
    'DIANA CARIÑOSA'
];

const descripcionBase = '✨ Una experiencia HOT 🔥 para disfrutar ✨';

// Función para leer imagen y convertir a base64
function imageToBase64(filename) {
    try {
        const filepath = path.join(__dirname, '..', filename);
        const data = fs.readFileSync(filepath);
        return 'data:image/jpeg;base64,' + data.toString('base64');
    } catch (err) {
        console.log(`⚠️  No se pudo leer: ${filename}`);
        return null;
    }
}

// Función para generar datos
async function seedData() {
    try {
        console.log('\n🌱 Iniciando seed de datos...\n');

        // Obtener usuarios
        const usersResult = await query('SELECT id FROM users LIMIT 2');

        if (usersResult.rows.length === 0) {
            console.log('❌ No hay usuarios. Crea usuarios primero con el login.');
            process.exit(1);
        }

        const users = usersResult.rows;
        console.log(`✓ Encontrados ${users.length} usuario(s)`);

        let modeloCount = 0;

        // Crear 20 modelos
        for (let i = 0; i < 20; i++) {
            const userId = users[i % users.length].id;
            const fotoFile = photoFiles[i % photoFiles.length];
            const foto = imageToBase64(fotoFile);

            if (!foto) continue;

            const nombre = nombres[i];
            const ubicacion = ubicaciones[i % ubicaciones.length];
            const serviciosArray = servicios[i % servicios.length];
            const enLinea = i % 3 !== 0; // 2 de 3 en línea
            const telefono = '+56912345679';
            const whatsapp = '+56912345679';
            const descripcion = descripcionBase;

            try {
                await query(
                    `INSERT INTO models (user_id, nombre, ubicacion, descripcion, servicios, foto, en_linea, telefono, whatsapp)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                    [
                        userId,
                        nombre,
                        ubicacion,
                        descripcion,
                        JSON.stringify(serviciosArray),
                        foto,
                        enLinea,
                        telefono,
                        whatsapp
                    ]
                );

                modeloCount++;
                const status = enLinea ? '🟢 En línea' : '⚫ Offline';
                console.log(`✓ ${i + 1}. ${nombre} (${ubicacion}) ${status}`);
            } catch (err) {
                console.error(`✗ Error en modelo ${i + 1}:`, err.message);
            }
        }

        console.log(`\n✅ Completado: ${modeloCount} modelos creados\n`);
        process.exit(0);

    } catch (err) {
        console.error('Error fatal:', err);
        process.exit(1);
    }
}

// Ejecutar
seedData();
