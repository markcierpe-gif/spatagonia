const fs = require('fs');
const path = require('path');

// Usar Sharp para comprimir imágenes (alternativa: usar ImageMagick)
// Como no tenemos Sharp instalado, usaremos una solución simple

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

console.log('📸 Analizando imágenes...\n');

let totalSize = 0;
photoFiles.forEach(file => {
    const filepath = path.join(__dirname, '..', file);
    try {
        const stats = fs.statSync(filepath);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`  ${file}: ${sizeMB} MB`);
        totalSize += stats.size;
    } catch (err) {
        console.log(`  ⚠️  ${file}: No encontrado`);
    }
});

console.log(`\n📊 Tamaño total: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
console.log('\n⚠️  NOTA: Las imágenes son muy grandes para base64');
console.log('Solución: Usar imágenes más pequeñas o una URL externa\n');

// Crear versión comprimida manualmente usando ffmpeg si está disponible
// O simplemente mostrar el problema
