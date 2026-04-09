// ===== GESTIÓN DE DATOS EN LOCALSTORAGE =====

const STORAGE_KEY = 'spatagonia_models';
const TOTAL_MODELS = 20;

// Estructura de modelo vacío
const emptyModel = {
    id: '',
    nombre: '',
    foto: '', // base64
    ubicacion: '',
    descripcion: '',
    servicios: [],
    en_linea: false,
    telefono: '',
    whatsapp: ''
};

// Datos de ejemplo para las primeras 3 modelos
const sampleModels = [
    {
        id: '1',
        nombre: 'VALENTINA LATINA',
        foto: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22280%22%3E%3Crect fill=%22%23c52828%22 width=%22200%22 height=%22280%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2224%22 fill=%22white%22%3EValentina%3C/text%3E%3C/svg%3E',
        ubicacion: 'Punta Arenas',
        descripcion: '🔥 Sensual, Curvas Latinas y Atención VIP',
        servicios: ['Video Call', 'Fotos'],
        en_linea: true,
        telefono: '+56912345678',
        whatsapp: '+56912345678'
    },
    {
        id: '2',
        nombre: 'PAOLITA Y NICOLE',
        foto: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22280%22%3E%3Crect fill=%22%239b2c2c%22 width=%22200%22 height=%22280%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2220%22 fill=%22white%22%3EPaolita %26 Nicole%3C/text%3E%3C/svg%3E',
        ubicacion: 'Puerto Natales',
        descripcion: '✨ Una experiencia HOT 🔥 para disfrutar ✨',
        servicios: ['Video Call', 'Fotos', 'Llamadas'],
        en_linea: true,
        telefono: '+56912345679',
        whatsapp: '+56912345679'
    },
    {
        id: '3',
        nombre: 'LORENA APRETADITA',
        foto: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22280%22%3E%3Crect fill=%22%23742a2a%22 width=%22200%22 height=%22280%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2220%22 fill=%22white%22%3ELorena%3C/text%3E%3C/svg%3E',
        ubicacion: 'Puerto Natales',
        descripcion: 'Piel trigueña, Ricas tetas y trasero jugoso, cariñosa',
        servicios: ['Video Call'],
        en_linea: false,
        telefono: '+56912345680',
        whatsapp: '+56912345680'
    }
];

// ===== FUNCIONES DE INICIALIZACIÓN =====

/**
 * Inicializa localStorage con 20 espacios (3 con datos ejemplo, 17 vacíos)
 */
function initializeStorage() {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return;

    const models = [];

    // Agregar 3 modelos de ejemplo
    models.push(...sampleModels);

    // Agregar 17 espacios vacíos
    for (let i = 4; i <= TOTAL_MODELS; i++) {
        models.push({
            ...emptyModel,
            id: String(i)
        });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
}

/**
 * Obtiene todos los modelos desde localStorage
 */
function getAllModels() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

/**
 * Obtiene un modelo por ID
 */
function getModelById(id) {
    const models = getAllModels();
    return models.find(m => m.id === String(id));
}

/**
 * Guarda un nuevo modelo o actualiza uno existente
 */
function saveModel(model) {
    const models = getAllModels();
    const index = models.findIndex(m => m.id === model.id);

    if (index >= 0) {
        models[index] = model;
    } else {
        model.id = String(Date.now());
        models.push(model);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
    return model;
}

/**
 * Elimina un modelo por ID
 */
function deleteModel(id) {
    const models = getAllModels();
    const index = models.findIndex(m => m.id === String(id));

    if (index >= 0) {
        // En lugar de eliminar, limpiar el modelo (dejar vacío)
        models[index] = {
            ...emptyModel,
            id: String(id)
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
        return true;
    }
    return false;
}

// ===== FUNCIONES DE UTILIDAD =====

/**
 * Convierte archivo a base64
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Genera UUID simple
 */
function generateId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Valida que un modelo tenga datos mínimos
 */
function validateModel(model) {
    if (!model.nombre || model.nombre.trim() === '') {
        return { valid: false, error: 'El nombre es requerido' };
    }
    if (!model.ubicacion) {
        return { valid: false, error: 'La ubicación es requerida' };
    }
    if (!model.telefono || model.telefono.trim() === '') {
        return { valid: false, error: 'El teléfono es requerido' };
    }
    return { valid: true };
}

/**
 * Verifica si un modelo está vacío
 */
function isEmptyModel(model) {
    return !model.nombre || model.nombre.trim() === '';
}

// Inicializar storage al cargar el script
initializeStorage();
