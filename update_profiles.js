// ===== SCRIPT PARA ACTUALIZAR 20 PERFILES CON DESCRIPCIONES ÚNICAS =====
// Instrucciones:
// 1. Inicia sesión en admin (https://spatagonia.onrender.com/login.html)
// 2. Ve a la página principal
// 3. Abre la consola (F12 o Ctrl+Shift+K)
// 4. Copia todo este script y pégalo en la consola
// 5. Presiona Enter para ejecutar

const profiles20 = [
    {
        id: 1,
        nombre: 'MARTINA LATINA',
        descripcion: '¡Hola mi amor! Soy Martina, una chilena guapa, simpática y muy apasionada. Me encanta disfrutar del placer mutuo y crear momentos realmente inolvidables. 💋\nOfrezco un trato cariñoso lleno de caricias, besos, un rico oral con pre, baile sensual y un sexo mojado e intenso en las posiciones que más te gusten. 💦🍑\nTambién realizo adicionales como americana corporal, 69, fantasías y tríos. Atiendo en mi domicilio discreto y salgo a hoteles, moteles, casas y domicilios.\nEscríbeme, te aseguro que no te arrepentirás. Aprovecha mis últimos días en la ciudad 😈❤️'
    },
    {
        id: 2,
        nombre: 'SOFÍA SENSUAL',
        descripcion: 'Hola guapo 😍 Soy Sofía, chilena, atractiva y con una sonrisa que enamora. Adoro el sexo rico, el placer compartido y pasar ratos exquisitos juntos.\nMi servicio incluye caricias suaves, poses variadas, un oral húmedo y profundo, baile erótico y un sexo bien mojado en las posiciones que desees. 💦😈\nHago adicionales: americana corporal, 69, fantasías y tríos. Atiendo en mi lugar discreto o voy a tu domicilio, hotel o motel.\nEscríbeme ya, no te vas a arrepentir. ¡Mis últimos días aquí! 🔥❤️'
    },
    {
        id: 3,
        nombre: 'VALENTINA APASIONADA',
        descripcion: '¡Hola mi amor! Me llamo Valentina, soy una chilena muy guapa y simpática con ganas de hacerte vivir una experiencia inolvidable.\nMe fascina el sexo placentero y mutuo. Te ofrezco caricias tiernas, oral con pre, baile sensual, poses ricas y un sexo mojado e intenso como más te guste. 🍑💦\nTambién incluyo adicionales: americana corporal, 69, fantasías sexuales y tríos.\nAtiendo en mi domicilio discreto y salgo a domicilios, hoteles y moteles.\nContáctame, aprovecha que estoy pocos días más en tu ciudad. Te voy a encantar 😘😈'
    },
    {
        id: 4,
        nombre: 'JESSICA HOT',
        descripcion: 'Hola cielo 💕 Soy Jessica, chilena guapa, alegre y ardiente. Me encanta consentirte y disfrutar de un placer rico y mutuo.\nIncluyo trato cariñoso con muchas caricias, oral delicioso con pre, baile sensual, y un sexo húmedo y apasionado en todas las posiciones que quieras.\nAdicionales disponibles: americana corporal, 69, fantasías y tríos.\nRecibo en mi lugar privado y cómodo, o voy a tu casa, hotel o motel.\nEscríbeme, no te arrepentirás de conocerme. ¡Últimos días en la ciudad! 🔥💋'
    },
    {
        id: 5,
        nombre: 'CAMILA CARIÑOSA',
        descripcion: '¡Hey mi amor! Soy Camila, una chilena preciosa y muy simpática que adora los encuentros intensos y placenteros.\nTe propongo un momento exquisito lleno de caricias, besos, rico oral, baile erótico y sexo bien mojado en las poses más calientes que imagines. 💦😈\nTambién hago americana corporal, 69, tríos y cualquier fantasía que tengas en mente.\nAtiendo en domicilio discreto y salgo a hoteles, moteles y domicilios.\nEscríbeme ahora, aprovecha mis últimos días aquí. Te haré pasar un rato inolvidable ❤️🍑'
    },
    {
        id: 6,
        nombre: 'DANIELA BELLA',
        descripcion: 'Hola guapo 😘 Soy Daniela, chilena atractiva, simpática y con mucha pasión. Me encanta el sexo rico y hacer que ambos disfrutemos al máximo.\nMi servicio incluye caricias suaves, oral con pre, baile sensual, poses variadas y un sexo intenso y mojado como más te excite.\nAdicionales: americana corporal, 69, fantasías y tríos.\nAtención en mi domicilio discreto o salidas a tu lugar (casa, hotel, motel).\nNo dudes en escribirme, te prometo que no te arrepentirás. ¡Estoy por pocos días más! 💦❤️'
    },
    {
        id: 7,
        nombre: 'ROXANA PASIONAL',
        descripcion: '¡Hola mi rey! Me llamo Roxana, una chilena guapa y encantadora con ganas de vivir momentos calientes y memorables contigo.\nTe ofrezco un trato dulce y ardiente: caricias, oral profundo con pre, baile sensual y sexo rico y mojado en las posiciones que prefieras. 😈💦\nTambién realizo americana corporal, 69, tríos y todas las fantasías que quieras.\nRecibo en lugar discreto y voy a domicilios, hoteles y moteles.\nEscríbeme, aprovecha que pronto me voy de la ciudad. ¡Te voy a hacer disfrutar mucho! 🍑❤️'
    },
    {
        id: 8,
        nombre: 'ANDREA SEXY',
        descripcion: 'Hola amorcito 😍 Soy Andrea, chilena muy guapa, simpática y fogosa. Adoro consentir y ser consentida con rico sexo y placer mutuo.\nIncluyo caricias apasionadas, oral con pre, baile erótico, poses ricas y un sexo bien mojado e intenso.\nAdicionales disponibles: americana corporal, 69, fantasías sexuales y tríos.\nAtiendo en mi domicilio privado y también salgo a hoteles, moteles y domicilios.\nContáctame ya, no te vas a arrepentir. Últimos días en tu ciudad 🔥💋'
    },
    {
        id: 9,
        nombre: 'GABRIELA SEXY',
        descripcion: '¡Hola mi amor! Soy Gabriela, una chilena atractiva, alegre y muy sensual. Me encanta crear encuentros llenos de placer y deseo.\nTe brindo caricias tiernas, un rico oral con pre, baile sensual, y un sexo húmedo y apasionado en todas las poses que desees. 💦🍑\nTambién hago americana corporal, 69, tríos y fantasías a tu medida.\nAtención en mi lugar discreto o voy donde estés (hotel, motel, casa).\nEscríbeme, aprovecha mis últimos días aquí. Te haré vivir algo exquisito 😘😈'
    },
    {
        id: 10,
        nombre: 'LUNA JOVENCITA',
        descripcion: 'Hola guapo 💋 Soy Luna, chilena guapa y simpática con muchas ganas de pasarlo increíble contigo.\nMe fascina el placer mutuo: caricias suaves, oral delicioso, baile sensual, sexo mojado y las posiciones más ricas y calientes.\nOfrezco además americana corporal, 69, fantasías y tríos.\nAtiendo en domicilio discreto y salidas a hoteles, moteles y casas.\nNo lo pienses más y escríbeme. ¡Mis últimos días en la ciudad, no te quedes sin conocerme! ❤️🔥🍑'
    },
    {
        id: 11,
        nombre: 'ISABELA HERMOSA',
        descripcion: '¡Hola cariño! Soy Isabela, una colombiana ardiente y muy sensual. Vine a disfrutar contigo de encuentros intensos y memorables.\nTe ofrezco un tratamiento VIP: caricias provocadoras, un oral profesional con mucho pre, baile erótico envolvente y un sexo bien caliente en todas las posiciones.\nAdicionales: americana corporal, 69, 90, fantasías BDSM-friendly y tríos.\nRecibo en mi lugar cómodo y discreto, también hago salidas a hoteles y domicilios.\nEscríbeme, te prometo momentos inolvidables 🔥💋'
    },
    {
        id: 12,
        nombre: 'LUISA COLOMBIANA',
        descripcion: 'Hola amor 😈 Soy Luisa, colombiana con cuerpo de revista y una lengua que te enloquecerá. Adoro el sexo sin tabúes y las experiencias nuevas.\nMi especialidad es hacer que disfrutes al máximo: caricias sensuales, un oral experto con pre, baile hipnotizante y sexo mojado y apasionado.\nAdicionales: posiciones extremas, americana corporal, 69, tríos y cualquier fantasía que quieras explorar.\nAtención en domicilio privado o voy a tu hotel favorito.\nNo dudes en contactarme, te haré sentir como un rey 👑💦'
    },
    {
        id: 13,
        nombre: 'NATALIA URUGUAYA',
        descripcion: '¡Hola mi cielo! Soy Natalia, una hermosa uruguaya de carácter fogoso y muy sensual. Vivo para disfrutar del placer en todas sus formas.\nTe propongo encuentros llenos de adrenalina: caricias apasionadas, oral profundo con técnica, baile sensual y un sexo bien mojado e intenso.\nEspecialidades: americana corporal, 69, squirting garantizado, tríos y fantasías sin límites.\nRecibo en mi domicilio discreto y también hago salidas a hoteles y moteles.\nEscríbeme, te voy a hacer pasar la mejor noche de tu vida 🍑💦😈'
    },
    {
        id: 14,
        nombre: 'KATERINA EUROPEA',
        descripcion: 'Hola guapo 💕 Soy Katerina, una hermosa mujer europea de clase y elegancia. Ofrezco un servicio VIP de acompañamiento y placer.\nEspecializado en GFE (novia por una noche): conversación inteligente, caricias delicadas, un oral exquisito con pre, baile sensual y sexo apasionado en las posiciones que prefieras.\nAdicionales: posiciones especiales, 69, fantasías románticas y tríos.\nAtención en hoteles de lujo y domicilios selectos.\nEscríbeme para agendar momentos de verdadero lujo y placer 🌹💎'
    },
    {
        id: 15,
        nombre: 'ALEJANDRA MEXICANA',
        descripcion: '¡Ándale guapo! Soy Alejandra, una nena mexicana con mucho sabor y pasión. Me encanta el sexo sin tabúes y explorar nuevas fantasías.\nTe ofrezco un servicio completo: caricias provocadoras, un oral experto con mucho pre, baile erótico ardiente y un sexo rico y mojado.\nEspecialidades: BDSM-friendly, americana corporal, 69, posiciones extremas, fetish y todas tus fantasías.\nRecibo en domicilio discreto y hago salidas a hoteles.\nNo lo pienses más y contáctame. ¡Te voy a enamorar! 🔥💋'
    },
    {
        id: 16,
        nombre: 'VANESSA PERUANA',
        descripcion: 'Hola amor 😍 Soy Vanessa, peruana con ese carisma y sensualidad que caracteriza a las nenas de Lima. Adoro las fiestas y pasar buenos momentos.\nMi servicio incluye: caricias apasionadas, oral con técnica, baile sensual muy movido, drinks y un sexo bien mojado e intenso.\nAdicionales: americana corporal, 69, tríos y cualquier fantasía de party girl que tengas.\nAtención en domicilio cómodo y salidas a hoteles y fiestas.\nEscríbeme para disfrutar juntos 🎉💦'
    },
    {
        id: 17,
        nombre: 'SABRINA BRASILEÑA',
        descripcion: '¡Oi gatão! Soy Sabrina, una brasileña ardiente con ese tumbao y pasión que nos caracteriza. Soy muy sensual y muero por disfrutar.\nTe ofrezco un tratamiento de lujo: caricias apasionadas, oral profundo con mucho pre, baile sensual brasileño, y un sexo rico bien mojado.\nAdicionales: americana corporal, 69, 90, tríos y fantasías apasionadas.\nRecibo en domicilio discreto y hago salidas a hoteles.\nContáctame, te voy a hacer vivir momentos inolvidables 🍑💦❤️'
    },
    {
        id: 18,
        nombre: 'FLORENCIA CHILENA',
        descripcion: '¡Hola mi amor! Soy Florencia, una chilena muy guapa con una pasión sin límites por el sexo. Me encanta experimentar cosas nuevas.\nTe propongo encuentros intensos y sin tabúes: caricias sensuales, un oral experto con pre, baile provocador y un sexo bien mojado e insaciable.\nEspecialidades: americana corporal, 69, fantasías BDSM, posiciones extremas y tríos.\nRecibo en domicilio privado y voy a hoteles.\nEscríbeme, te voy a quitar el sentido 🔥😈'
    },
    {
        id: 19,
        nombre: 'MARIANA PARAGUAYA',
        descripcion: 'Hola guapo 💋 Soy Mariana, paraguaya bilingüe y muy sensual con el encanto de las nenas del Cono Sur. Soy bisexual y muy abierta.\nMi servicio: caricias apasionadas, oral con técnica profesional, baile erótico y un sexo apasionado en todas las posiciones.\nAdicionales: americana corporal, 69, tríos (MMF, MFF), fantasías bisexuales y posiciones especiales.\nAtención en domicilio cómodo y salidas a hoteles.\nEscríbeme para experiencias inolvidables 👩‍❤️‍👨💦'
    },
    {
        id: 20,
        nombre: 'ISABELLA ARGENTINA',
        descripcion: '¡Hola che! Soy Isabella, argentina porteña con ese estilo y sensualidad típica. Me encanta los encuentros apasionados y sin límites.\nOfrezco un servicio completo: caricias intensas, oral profundo con pre, baile sensual, y un sexo bien mojado e insaciable.\nEspecialidades: americana corporal, 69, BDSM friendly, posiciones extremas, fantasías sin tabúes y tríos.\nRecibo en domicilio privado y hago salidas a hoteles.\nContáctame para momentos de puro placer y adrenalina 🔥👅'
    }
];

async function updateAllProfiles() {
    const token = sessionStorage.getItem('token');

    if (!token) {
        console.error('❌ ERROR: No hay token. Por favor inicia sesión primero.');
        return;
    }

    console.log('🔄 Comenzando actualización de 20 perfiles...');
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < profiles20.length; i++) {
        const profile = profiles20[i];
        try {
            const response = await fetch(`/api/models/${profile.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: profile.nombre,
                    descripcion: profile.descripcion
                })
            });

            if (response.ok) {
                console.log(`✅ Perfil ${profile.id} (${profile.nombre}) actualizado`);
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

        // Pequeña pausa entre requests para no saturar el servidor
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\n✨ COMPLETADO: ${successCount} perfiles actualizados, ${errorCount} errores`);
    if (errorCount === 0) {
        console.log('🎉 ¡Todos los perfiles fueron actualizados exitosamente!');
        console.log('⏰ Recarga la página para ver los cambios');
        setTimeout(() => window.location.reload(), 2000);
    }
}

// Ejecutar la actualización
updateAllProfiles();
