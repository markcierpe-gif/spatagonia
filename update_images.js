// ===== SCRIPT PARA ACTUALIZAR RUTAS DE IMÁGENES DE 20 PERFILES =====
// Instrucciones:
// 1. Inicia sesión en admin (https://spatagonia.onrender.com/login.html)
// 2. Ve a la página principal
// 3. Abre la consola (F12 o Ctrl+Shift+K)
// 4. Copia todo este script y pégalo en la consola
// 5. Presiona Enter para ejecutar

const imagePaths = [
    { id: 1, foto: '/images/profiles/profile-001.jpg' },
    { id: 2, foto: '/images/profiles/profile-002.jpg' },
    { id: 3, foto: '/images/profiles/profile-003.jpg' },
    { id: 4, foto: '/images/profiles/profile-004.jpg' },
    { id: 5, foto: '/images/profiles/profile-005.jpg' },
    { id: 6, foto: '/images/profiles/profile-006.jpg' },
    { id: 7, foto: '/images/profiles/profile-007.jpg' },
    { id: 8, foto: '/images/profiles/profile-008.jpg' },
    { id: 9, foto: '/images/profiles/profile-009.jpg' },
    { id: 10, foto: '/images/profiles/profile-010.jpg' },
    { id: 11, foto: '/images/profiles/profile-011.jpg' },
    { id: 12, foto: '/images/profiles/profile-012.jpg' },
    { id: 13, foto: '/images/profiles/profile-013.jpg' },
    { id: 14, foto: '/images/profiles/profile-014.jpg' },
    { id: 15, foto: '/images/profiles/profile-015.jpg' },
    { id: 16, foto: '/images/profiles/profile-016.jpg' },
    { id: 17, foto: '/images/profiles/profile-017.jpg' },
    { id: 18, foto: '/images/profiles/profile-018.jpg' },
    { id: 19, foto: '/images/profiles/profile-019.jpg' },
    { id: 20, foto: '/images/profiles/profile-020.jpg' }
];

async function updateAllImagePaths() {
    const token = sessionStorage.getItem('token');

    if (!token) {
        console.error('❌ ERROR: No hay token. Por favor inicia sesión primero.');
        return;
    }

    console.log('🔄 Comenzando actualización de rutas de imágenes...');
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < imagePaths.length; i++) {
        const profile = imagePaths[i];
        try {
            const response = await fetch(`/api/models/${profile.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    foto: profile.foto
                })
            });

            if (response.ok) {
                console.log(`✅ Perfil ${profile.id}: imagen actualizada a ${profile.foto}`);
                successCount++;
            } else {
                const err = await response.json();
                console.error(`❌ Error en perfil ${profile.id}: ${err.error}`);
                errorCount++;
            }
        } catch (err) {
            console.error(`❌ Error en perfil ${profile.id}: ${err.message}`);
            errorCount++;
        }

        // Pequeña pausa entre requests
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\n✨ COMPLETADO: ${successCount} imágenes actualizadas, ${errorCount} errores`);
    if (errorCount === 0) {
        console.log('🎉 ¡Todas las imágenes fueron actualizadas exitosamente!');
        console.log('⏰ Recarga la página para ver los cambios');
        setTimeout(() => window.location.reload(), 2000);
    }
}

// Ejecutar la actualización
updateAllImagePaths();
