const { query } = require('./config/db');

// URL pública de imagen (funciona en producción sin archivos locales)
const fotoUrl = 'https://via.placeholder.com/400x500.jpg?text=Modelo';

// Ubicaciones y cantidad de modelos por ubicación
const ubicaciones = {
    'Punta Arenas': 5,
    'Puerto Natales': 5,
    'Porvenir': 5,
    'Coyhaique': 5
};

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

const servicios = [
    ['Video Call', 'Fotos'],
    ['Video Call'],
    ['Fotos', 'Llamadas'],
    ['Video Call', 'Fotos', 'Llamadas'],
    ['Visita', 'Video Call'],
    ['Fotos'],
    ['Video Call', 'Visita'],
    ['Llamadas', 'Fotos'],
    ['Video Call', 'Fotos'],
    ['Visita']
];

const descripcionBase = '✨ Una experiencia HOT 🔥 para disfrutar ✨';
const telefono = '+56912345679';

// Función para generar datos
async function seedData() {
    try {
        console.log('\n🌱 Iniciando seed FINAL con imagen única...\n');

        // Obtener usuarios
        const usersResult = await query('SELECT id FROM users LIMIT 2');

        if (usersResult.rows.length === 0) {
            console.log('❌ No hay usuarios.');
            process.exit(1);
        }

        const users = usersResult.rows;
        console.log(`✓ Encontrados ${users.length} usuario(s)\n`);

        // Limpiar modelos anteriores
        await query('DELETE FROM models');
        console.log('🗑️  Modelos anteriores eliminados\n');

        let modeloCount = 0;
        let modeloIndex = 0;

        // Crear 20 modelos distribuidos por ubicación
        for (const [ubicacion, cantidad] of Object.entries(ubicaciones)) {
            console.log(`\n📍 ${ubicacion} (${cantidad} modelos)`);

            for (let i = 0; i < cantidad; i++) {
                const userId = users[modeloIndex % users.length].id;
                const nombre = nombres[modeloIndex];
                const serviciosArray = servicios[modeloIndex % servicios.length];
                const enLinea = i % 2 === 0; // Alternados: en línea / offline
                const whatsapp = telefono;

                try {
                    await query(
                        `INSERT INTO models (user_id, nombre, ubicacion, descripcion, servicios, foto, en_linea, telefono, whatsapp)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                        [
                            userId,
                            nombre,
                            ubicacion,
                            descripcionBase,
                            JSON.stringify(serviciosArray),
                            fotoUrl,
                            enLinea,
                            telefono,
                            whatsapp
                        ]
                    );

                    modeloCount++;
                    const status = enLinea ? '🟢' : '⚫';
                    console.log(`  ${status} ${nombre}`);
                    modeloIndex++;
                } catch (err) {
                    console.error(`  ✗ Error:`, err.message);
                }
            }
        }

        console.log(`\n✅ Completado: ${modeloCount} modelos creados`);
        console.log('   - 5 en Punta Arenas');
        console.log('   - 5 en Puerto Natales');
        console.log('   - 5 en Porvenir');
        console.log('   - 5 en Coyhaique');
        console.log('   - Alternados: en línea / offline\n');
        process.exit(0);

    } catch (err) {
        console.error('Error fatal:', err);
        process.exit(1);
    }
}

seedData();
