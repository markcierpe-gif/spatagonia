# Spatagonia - Sistema de Gestión de Modelos

## 📋 Descripción

Prototipo local funcional para gestionar un catálogo de modelos/escorts. Permite crear, editar, eliminar perfiles con fotos, información de contacto y estado de disponibilidad.

## ✨ Características

- ✅ **20 espacios para modelos** (3 con datos ejemplo, 17 vacíos)
- ✅ **Subida de fotos** con conversión a Base64
- ✅ **Información completa**: nombre, ubicación, descripción, servicios
- ✅ **Estado en línea** con indicador visual (verde/gris)
- ✅ **Contacto directo**: botones WhatsApp y teléfono
- ✅ **CRUD completo**: crear, editar, eliminar modelos
- ✅ **Almacenamiento local**: persiste en localStorage
- ✅ **Responsive**: funciona en móvil, tablet y desktop

## 🚀 Cómo Usar

### Opción 1: Abrir directamente en navegador
```bash
# Navega a la carpeta del proyecto
cd "C:\Users\Usuario\Desktop\sex patagonia"

# Abre index.html en tu navegador
# Windows: start index.html
# Mac: open index.html
# Linux: xdg-open index.html
```

### Opción 2: Usar servidor local Python (recomendado)
```bash
cd "C:\Users\Usuario\Desktop\sex patagonia"
python -m http.server 8000
# Abre http://localhost:8000 en tu navegador
```

## 📱 Cómo Usar la Aplicación

### Agregar un modelo
1. Haz clic en cualquier tarjeta vacía (con el símbolo ➕)
2. Se abrirá un formulario modal
3. Completa los campos:
   - **Nombre** (requerido)
   - **Ubicación** (requerido)
   - **Descripción**
   - **Servicios** (marca los que apliquen)
   - **Teléfono** (requerido)
   - **WhatsApp** (opcional)
   - **Foto** (JPG/PNG, máx 2MB)
   - **En Línea** (toggle para disponibilidad)
4. Haz clic en "Guardar"

### Editar un modelo existente
1. Haz clic en la tarjeta del modelo
2. Se abrirá el formulario con sus datos
3. Modifica lo que necesites
4. Haz clic en "Guardar"

### Eliminar un modelo
1. Abre el modelo (haz clic en la tarjeta)
2. Haz clic en el botón "Eliminar"
3. Confirma la eliminación

### Cambiar estado "En Línea"
1. Abre el modelo
2. Activa/desactiva el toggle "En Línea"
3. Guarda los cambios

## 🔧 Estructura Técnica

### Archivos
- `index.html` - Estructura HTML con grid dinámico y modal
- `styles.css` - Estilos responsivos y tema oscuro
- `script.js` - Lógica de interactividad y CRUD
- `data.js` - Gestión de localStorage y validación

### Datos Almacenados
Cada modelo guarda:
```json
{
  "id": "id-único",
  "nombre": "nombre del modelo",
  "foto": "base64-encoded-image",
  "ubicacion": "Punta Arenas",
  "descripcion": "descripción",
  "servicios": ["Video Call", "Fotos"],
  "en_linea": true,
  "telefono": "+56912345678",
  "whatsapp": "+56912345678"
}
```

## 🎨 Personalización

### Cambiar colores
Edita las variables CSS en `styles.css`:
```css
:root {
    --primary-red: #c52828;
    --dark-bg: #000000;
    --dark-gray: #1a1a1a;
}
```

### Agregar más ubicaciones
En `index.html`, edita el `<select>` en el modal:
```html
<option value="Mi Ubicación">Mi Ubicación</option>
```

### Cambiar número de espacios
En `data.js`, modifica:
```javascript
const TOTAL_MODELS = 20; // Cambiar a 25, 30, etc.
```

## ⚠️ Notas Técnicas

- Los datos se guardan en `localStorage` del navegador
- No se pierden al cerrar la pestaña
- Se pierden si limpias el historial/datos del navegador
- No requiere servidor backend
- Compatible con: Chrome, Firefox, Safari, Edge

## 🔒 Privacidad

- Todos los datos se almacenan **localmente** en tu navegador
- Las imágenes se codifican en Base64 (no se envían a ningún servidor)
- No se recopilan datos personales
- No se hacen requests a internet

## 📞 Funcionalidades de Contacto

### Botón WhatsApp
- Abre WhatsApp Web con el número guardado
- URL: `https://wa.me/{numero}?text=Hola`

### Botón Teléfono
- Abre la app de llamadas (móvil) o marcador (desktop)
- URL: `tel:{numero}`

## 🚧 Mejoras Futuras

- [ ] Búsqueda y filtrado de modelos
- [ ] Fotos múltiples por modelo
- [ ] Export/Import de datos (JSON)
- [ ] Drag-drop para reordenar
- [ ] Gallería de fotos mejorada
- [ ] Estadísticas de visualizaciones

## 📞 Soporte

Para reportar problemas o sugerir mejoras, revisa los archivos:
- Errores en consola: F12 → Console
- Errores de servidor: Revisa logs de Python

---

**Versión:** 1.0  
**Última actualización:** 2026-04-08  
**Estado:** Prototipo funcional local ✓
