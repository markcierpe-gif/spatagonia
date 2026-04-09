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

// Image preview handler
modelPhoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            document.getElementById('previewImg').src = ev.target.result;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Variables globales
let currentEditingId = null;
let allModels = [];
let currentFilter = null;

// ===== HELPER: Token =====
function getToken() {
    return sessionStorage.getItem('token');
}

function isAdmin() {
    return !!getToken();
}

// ===== HELPER: Convertir archivo a base64 =====
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

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
        if (sideMenu.classList.contains('active')) closeMenuFunc();
        if (modelModal.classList.contains('active')) closeModalFunc();
        // Cerrar detalle visitante
        const detail = document.querySelector('.model-detail-overlay');
        if (detail) detail.remove();
    }
});

// ===== FUNCIONES DEL MODAL =====

function openModal(modelId = null) {
    if (modelId && !isAdmin()) {
        // MODO VISITANTE - mostrar detalle sin edición
        const model = allModels.find(m => m.id === modelId);
        if (!model) return;

        const cleanPhone = (model.telefono || '+56912345679').replace(/\D/g, '');
        const cleanWhatsapp = (model.whatsapp || model.telefono || '+56912345679').replace(/\D/g, '');
        const servicios = Array.isArray(model.servicios) ? model.servicios.join(', ') : '';
        let imageUrl = model.foto || '';

        const detailDiv = document.createElement('div');
        detailDiv.className = 'model-detail-overlay';
        detailDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
        detailDiv.innerHTML = `
            <div style="background:#1a1a1a;border-radius:12px;max-width:400px;width:100%;max-height:90vh;overflow-y:auto;">
                <div style="position:relative;">
                    <img src="${imageUrl}" alt="${model.nombre}" style="width:100%;height:300px;object-fit:cover;border-radius:12px 12px 0 0;">
                    <button onclick="this.closest('.model-detail-overlay').remove()" style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.7);color:white;border:none;border-radius:50%;width:44px;height:44px;font-size:20px;cursor:pointer;">✕</button>
                    <span style="position:absolute;bottom:10px;left:10px;background:${model.en_linea ? '#22c55e' : '#666'};color:white;padding:4px 12px;border-radius:20px;font-size:12px;">${model.en_linea ? '🟢 En linea' : '⚫ Offline'}</span>
                </div>
                <div style="padding:20px;">
                    <h2 style="color:white;margin-bottom:8px;">${model.nombre}</h2>
                    <p style="color:#aaa;margin-bottom:12px;">📍 ${model.ubicacion}</p>
                    <p style="color:#ccc;margin-bottom:16px;">${model.descripcion}</p>
                    ${servicios ? `<p style="color:#aaa;margin-bottom:16px;">🏷️ ${servicios}</p>` : ''}
                    <div style="display:flex;gap:12px;">
                        <a href="https://wa.me/${cleanWhatsapp}?text=Hola" target="_blank" style="flex:1;background:#25D366;color:white;padding:14px;border-radius:8px;text-align:center;text-decoration:none;font-weight:bold;font-size:16px;">📱 WhatsApp</a>
                        <a href="tel:+${cleanPhone}" style="flex:1;background:#c52828;color:white;padding:14px;border-radius:8px;text-align:center;text-decoration:none;font-weight:bold;font-size:16px;">📞 Llamar</a>
                    </div>
                </div>
            </div>
        `;
        detailDiv.addEventListener('click', (e) => {
            if (e.target === detailDiv) detailDiv.remove();
        });
        document.body.appendChild(detailDiv);
        return;
    }

    currentEditingId = modelId;

    if (modelId) {
        // Modo EDITAR (admin con login)
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

// ===== SUBMIT FORMULARIO (CONECTADO A API) =====

modelForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!modelName.value.trim()) { alert('El nombre es requerido'); return; }
    if (!modelLocation.value) { alert('La ubicacion es requerida'); return; }
    if (!modelPhone.value.trim()) { alert('El telefono es requerido'); return; }

    const token = getToken();
    if (!token) { alert('Debes iniciar sesion'); return; }

    // Get submit button and show loading state
    const submitBtn = modelForm.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';

    // Construir datos del modelo
    const modelData = {
        nombre: modelName.value.trim(),
        ubicacion: modelLocation.value,
        descripcion: modelDescription.value.trim(),
        telefono: modelPhone.value.trim(),
        whatsapp: modelWhatsapp.value.trim() || modelPhone.value.trim(),
        en_linea: modelOnline.checked,
        servicios: Array.from(serviceCheckboxes).filter(cb => cb.checked).map(cb => cb.value)
    };

    // Procesar foto si se seleccionó
    if (modelPhoto.files.length > 0) {
        const file = modelPhoto.files[0];
        if (file.size > 2 * 1024 * 1024) { alert('La imagen es muy grande (max 2MB)'); submitBtn.disabled = false; submitBtn.textContent = originalText; return; }
        try {
            modelData.foto = await fileToBase64(file);
        } catch (err) {
            alert('Error al procesar la imagen');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            return;
        }
    }

    try {
        let response;
        if (currentEditingId) {
            // ACTUALIZAR modelo existente via API
            response = await fetch(`${API_URL}/models/${currentEditingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(modelData)
            });
        } else {
            // CREAR nuevo modelo via API
            response = await fetch(`${API_URL}/models`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(modelData)
            });
        }

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || `Error ${response.status}`);
        }

        // Éxito
        submitBtn.textContent = '✓ Guardado!';
        setTimeout(() => {
            closeModalFunc();
            renderProfiles();
        }, 500);

    } catch (err) {
        // Mostrar error en modal, no alert
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'background:#c52828;color:white;padding:12px;border-radius:4px;margin-bottom:12px;font-size:14px;';
        errorDiv.textContent = 'Error: ' + err.message;
        modelForm.insertBefore(errorDiv, modelForm.firstChild);

        setTimeout(() => errorDiv.remove(), 5000);

        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

// Botón eliminar (conectado a API)
formDelete.addEventListener('click', async () => {
    if (!confirm('¿Estas seguro de que deseas eliminar este modelo?')) return;

    const token = getToken();
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/models/${currentEditingId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al eliminar');

        closeModalFunc();
        renderProfiles();
    } catch (err) {
        alert('Error: ' + err.message);
    }
});

// ===== RENDERIZAR GRID =====

async function renderProfiles() {
    // Mostrar estado de carga
    profilesGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#888;">Cargando modelos...</div>';

    try {
        const token = getToken();

        let response;
        if (token) {
            response = await fetch(`${API_URL}/models`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } else {
            response = await fetch(`${API_URL}/models/public/all`);
        }

        if (!response.ok) throw new Error('No se pudieron cargar los modelos');

        allModels = await response.json();
        profilesGrid.innerHTML = '';

        if (allModels.length === 0) {
            profilesGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#888;">No hay modelos disponibles</div>';
            return;
        }

        // Filtrar si hay filtro activo
        const modelsToShow = currentFilter
            ? allModels.filter(m => m.ubicacion === currentFilter)
            : allModels;

        if (modelsToShow.length === 0) {
            profilesGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#888;">No hay modelos en ${currentFilter} <br><a href="#" onclick="clearFilter();return false;" style="color:#c52828;">Ver todas</a></div>`;
            return;
        }

        modelsToShow.forEach((model) => {
            const card = document.createElement('article');
            card.className = 'profile-card';

            let imageUrl = model.foto;
            if (model.foto && model.foto.startsWith('/images/')) {
                imageUrl = window.location.hostname === 'localhost' ? `http://localhost:5000${model.foto}` : model.foto;
            }

            const imageHtml = imageUrl ? `<img src="${imageUrl}" alt="Foto de ${model.nombre}, escort en ${model.ubicacion}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">` : '';

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
        profilesGrid.innerHTML = '<p style="padding: 20px; color: #ccc;">Error al cargar modelos. Intenta recargar la pagina.</p>';
    }
}

// ===== FILTROS Y MENÚ =====

const filterButtons = document.querySelectorAll('.filter-btn, .view-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        const parentSection = this.closest('.filters-horizontal, .view-buttons');
        if (parentSection) {
            parentSection.querySelectorAll('.active').forEach(btn => btn.classList.remove('active'));
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

        if (text.includes('PUNTA ARENAS')) ubicacion = 'Punta Arenas';
        else if (text.includes('PUERTO NATALES')) ubicacion = 'Puerto Natales';
        else if (text.includes('PORVENIR')) ubicacion = 'Porvenir';
        else if (text.includes('COYHAIQUE')) ubicacion = 'Coyhaique';

        if (ubicacion) {
            // Marcar item activo
            menuItems.forEach(i => i.style.color = '');
            this.style.color = '#c52828';

            closeMenuFunc();
            currentFilter = ubicacion;
            renderProfiles();

            setTimeout(() => {
                profilesGrid.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    });
});

function clearFilter() {
    currentFilter = null;
    menuItems.forEach(i => i.style.color = '');
    renderProfiles();
}

// ===== BOTONES FLOTANTES FUNCIONALES =====

const whatsappBtn = document.querySelector('.float-btn.whatsapp');
const phoneBtn = document.querySelector('.float-btn.phone');

if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const num = '+56912345679';
        window.open(`https://wa.me/${num.replace(/\D/g, '')}?text=Hola`, '_blank');
    });
}

if (phoneBtn) {
    phoneBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'tel:+56912345679';
    });
}

// ===== LOGOUT =====

function logout() {
    sessionStorage.clear();
    window.location.reload();
}

// ===== INICIALIZACIÓN =====

document.addEventListener('DOMContentLoaded', () => {
    renderProfiles();

    // Mostrar/ocultar botón logout y admin según login
    if (isAdmin()) {
        const header = document.querySelector('.header');
        if (header) {
            const logoutBtn = document.createElement('button');
            logoutBtn.textContent = 'Salir';
            logoutBtn.style.cssText = 'background:#c52828;color:white;border:none;border-radius:4px;padding:6px 14px;font-size:13px;cursor:pointer;position:absolute;right:16px;top:50%;transform:translateY(-50%);';
            logoutBtn.addEventListener('click', logout);
            header.style.position = 'relative';
            header.appendChild(logoutBtn);
        }
    }
});
