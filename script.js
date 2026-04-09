// ===== CONFIGURACIÓN API =====
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';

// ===== ELEMENTOS DEL DOM =====
const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const profilesGrid = document.getElementById('profilesGrid');
const modelModal = document.getElementById('modelModal');
const modalTitle = document.getElementById('modalTitle');
const modalClose = document.getElementById('modalClose');
const modelForm = document.getElementById('modelForm');
const formCancel = document.getElementById('formCancel');
const formDelete = document.getElementById('formDelete');

// Inputs del formulario
const modelName = document.getElementById('modelName');
const modelLocation = document.getElementById('modelLocation');
const modelDescription = document.getElementById('modelDescription');
const modelPhone = document.getElementById('modelPhone');
const modelWhatsapp = document.getElementById('modelWhatsapp');
const modelPhoto = document.getElementById('modelPhoto');
const modelOnline = document.getElementById('modelOnline');
const serviceCheckboxes = document.querySelectorAll('.service-checkbox');

// Variables globales
let currentEditingId = null;
let allModels = [];

// ===== FUNCIONES DEL MENÚ =====

function openMenu() {
    sideMenu.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenuFunc() {
    sideMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', openMenu);
closeMenu.addEventListener('click', closeMenuFunc);
menuOverlay.addEventListener('click', closeMenuFunc);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (sideMenu.classList.contains('active')) {
            closeMenuFunc();
        }
        if (modelModal.classList.contains('active')) {
            closeModalFunc();
        }
    }
});

// ===== FUNCIONES DEL MODAL =====

function openModal(modelId = null) {
    currentEditingId = modelId;

    if (modelId) {
        // Modo EDITAR
        const model = allModels.find(m => m.id === modelId);
        if (!model) return;

        modalTitle.textContent = 'Editar Modelo';
        formDelete.style.display = 'flex';

        modelName.value = model.nombre;
        modelLocation.value = model.ubicacion;
        modelDescription.value = model.descripcion;
        modelPhone.value = model.telefono;
        modelWhatsapp.value = model.whatsapp;
        modelOnline.checked = model.en_linea;

        // Cargar servicios
        const servicios = Array.isArray(model.servicios) ? model.servicios : [];
        serviceCheckboxes.forEach(checkbox => {
            checkbox.checked = servicios.includes(checkbox.value);
        });
    } else {
        // Modo CREAR
        modalTitle.textContent = 'Agregar Modelo';
        formDelete.style.display = 'none';
        modelForm.reset();
        modelOnline.checked = false;
    }

    modelModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModalFunc() {
    modelModal.classList.remove('active');
    document.body.style.overflow = '';
    currentEditingId = null;
    modelForm.reset();
}

modalClose.addEventListener('click', closeModalFunc);
formCancel.addEventListener('click', closeModalFunc);
modelModal.addEventListener('click', (e) => {
    if (e.target === modelModal) closeModalFunc();
});

// ===== SUBMIT FORMULARIO =====

modelForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validar campos requeridos
    if (!modelName.value.trim()) {
        alert('El nombre es requerido');
        return;
    }
    if (!modelLocation.value) {
        alert('La ubicación es requerida');
        return;
    }
    if (!modelPhone.value.trim()) {
        alert('El teléfono es requerido');
        return;
    }

    // Obtener modelo actual o crear uno nuevo
    let model = currentEditingId ? getModelById(currentEditingId) : { ...emptyModel, id: generateId() };

    // Actualizar datos
    model.nombre = modelName.value.trim();
    model.ubicacion = modelLocation.value;
    model.descripcion = modelDescription.value.trim();
    model.telefono = modelPhone.value.trim();
    model.whatsapp = modelWhatsapp.value.trim() || modelPhone.value.trim();
    model.en_linea = modelOnline.checked;

    // Servicios seleccionados
    model.servicios = Array.from(serviceCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    // Procesar foto si se seleccionó
    if (modelPhoto.files.length > 0) {
        const file = modelPhoto.files[0];
        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen es muy grande (máx 2MB)');
            return;
        }
        try {
            model.foto = await fileToBase64(file);
        } catch (err) {
            alert('Error al procesar la imagen');
            return;
        }
    }

    // Guardar en localStorage
    saveModel(model);

    // Cerrar modal y renderizar
    closeModalFunc();
    renderProfiles();
});

// Botón eliminar
formDelete.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que deseas eliminar este modelo?')) {
        deleteModel(currentEditingId);
        closeModalFunc();
        renderProfiles();
    }
});

// ===== RENDERIZAR GRID =====

async function renderProfiles() {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }

        // Fetch modelos desde API
        const response = await fetch(`${API_URL}/models`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('No se pudieron cargar los modelos');
        }

        allModels = await response.json();
        profilesGrid.innerHTML = '';

        allModels.forEach((model) => {
            const card = document.createElement('article');
            card.className = 'profile-card';

            // Convertir URL relativa a absoluta (apuntar al backend)
            let imageUrl = model.foto;
            if (model.foto && model.foto.startsWith('/images/')) {
                imageUrl = window.location.hostname === 'localhost' ? `http://localhost:5000${model.foto}` : model.foto;
            }

            // Tarjeta con datos - usando <img> en lugar de background-image
            const imageHtml = imageUrl ? `<img src="${imageUrl}" alt="${model.nombre}" style="width: 100%; height: 100%; object-fit: cover;">` : '';

            card.innerHTML = `
                <div class="profile-image">
                    ${imageHtml}
                    ${Array.isArray(model.servicios) && model.servicios.includes('Video Call') ? '<span class="video-badge">📹</span>' : ''}
                    <span class="online-indicator ${model.en_linea ? 'active' : 'inactive'}"></span>
                </div>
                <div class="profile-info">
                    <h3 class="profile-name">${model.nombre}</h3>
                    <p class="profile-description">${model.descripcion}</p>
                    <div class="profile-location">
                        <span>📍 ${model.ubicacion}</span>
                    </div>
                </div>
            `;
            card.addEventListener('click', () => openModal(model.id));

            profilesGrid.appendChild(card);
        });
    } catch (err) {
        console.error('Error renderizando perfiles:', err);
        profilesGrid.innerHTML = '<p style="padding: 20px; color: #ccc;">Error al cargar modelos</p>';
    }
}

// ===== SMOOTH SCROLL =====

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== FILTROS Y MENÚ =====

const filterButtons = document.querySelectorAll('.filter-btn, .view-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        const parentSection = this.closest('.filters-horizontal, .view-buttons');
        if (parentSection) {
            parentSection.querySelectorAll('.active').forEach(btn => {
                btn.classList.remove('active');
            });
        }
        this.classList.add('active');
    });
});

// ===== MENÚ LATERAL: FILTRAR POR UBICACIÓN =====

const menuItems = document.querySelectorAll('.menu-list li');
menuItems.forEach(item => {
    item.addEventListener('click', function() {
        const text = this.textContent.trim().toUpperCase();
        let ubicacion = null;

        // Detectar ubicación del menú
        if (text.includes('PUNTA ARENAS')) ubicacion = 'Punta Arenas';
        else if (text.includes('PUERTO NATALES')) ubicacion = 'Puerto Natales';
        else if (text.includes('PORVENIR')) ubicacion = 'Porvenir';
        else if (text.includes('COYHAIQUE')) ubicacion = 'Coyhaique';

        // Si es una ubicación válida, filtrar
        if (ubicacion) {
            closeMenuFunc();
            filterModelsByLocation(ubicacion);

            // Scroll a los modelos
            setTimeout(() => {
                document.getElementById('profilesGrid').scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    });
});

// Función para filtrar por ubicación
function filterModelsByLocation(ubicacion) {
    const cards = document.querySelectorAll('.profile-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const cardText = card.textContent;
        if (cardText.includes(ubicacion)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Si no hay resultados, mostrar todos
    if (visibleCount === 0) {
        cards.forEach(card => card.style.display = 'block');
    }
}

// ===== LAZY LOADING =====

const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '1';
            observer.unobserve(img);
        }
    });
}, observerOptions);

// ===== DETECTAR SCROLL PARA LAZY LOADING =====

let isLoading = false;
window.addEventListener('scroll', () => {
    if (isLoading) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 500) {
        isLoading = true;
        setTimeout(() => {
            isLoading = false;
        }, 1000);
    }
});

// ===== BOTONES FLOTANTES FUNCIONALES =====

const whatsappBtn = document.querySelector('.float-btn.whatsapp');
const phoneBtn = document.querySelector('.float-btn.phone');

// Obtener número desde el primer modelo o usar el default
function getPhoneNumbers() {
    if (allModels.length > 0) {
        return {
            whatsapp: allModels[0].whatsapp || '+56912345679',
            phone: allModels[0].telefono || '+56912345679'
        };
    }
    return {
        whatsapp: '+56912345679',
        phone: '+56912345679'
    };
}

// WhatsApp
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const { whatsapp } = getPhoneNumbers();
        const cleanNum = whatsapp.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanNum}?text=Hola`, '_blank');
    });
}

// Teléfono
if (phoneBtn) {
    phoneBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const { phone } = getPhoneNumbers();
        window.location.href = `tel:${phone}`;
    });
}

// ===== PREVENIR ZOOM EN INPUTS (iOS) =====

document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// ===== INICIALIZACIÓN =====

document.addEventListener('DOMContentLoaded', () => {
    // Verificar token antes de mostrar contenido
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Cargar perfiles
    renderProfiles();
});
