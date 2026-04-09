# Credenciales de Acceso

## 🔑 Tu Cuenta

```
Email:      cierpeh@gmail.com
Contraseña: Marco1981@
```

---

## 🚀 Cómo Acceder

### 1. Inicia el Backend
```bash
cd "C:\Users\Usuario\Desktop\sex patagonia\backend"
npm run dev
```

### 2. Inicia el Frontend
```bash
cd "C:\Users\Usuario\Desktop\sex patagonia"
python -m http.server 8000
```

### 3. Abre el Navegador
- Ve a: `http://localhost:8000/login.html`
- Email: `cierpeh@gmail.com`
- Contraseña: `Marco1981@`
- Haz clic en "Iniciar Sesión"

### 4. ¡Acceso Garantizado!
Se redirige automáticamente a:
- `http://localhost:8000/index.html`

Verás los **20 modelos** con tus fotos.

---

## 📋 Setup Completo (Primeras veces)

Lee el archivo: **SETUP_COMPLETE.md**

Resumido:
1. Instala PostgreSQL
2. Crea BD: `CREATE DATABASE spatagonia;`
3. Configura `.env`
4. Inicia Backend
5. Registra usuario: `curl` con estas credenciales
6. Ejecuta: `node seed-data.js` (llena los 20 modelos)
7. Inicia Frontend
8. Login con estas credenciales

---

## 💡 Nota

Estas credenciales se usan para:
- ✅ Registrarse (primera vez)
- ✅ Iniciar sesión (accesos posteriores)
- ✅ Editar modelos
- ✅ Ver datos compartidos

Guarda esta información en un lugar seguro.

---

## 🔄 Si Necesitas Resetear

Si algo falla:
```bash
# Elimina la BD
dropdb spatagonia

# Crea nueva
createdb spatagonia

# Backend crea tablas automáticamente
npm run dev

# Registra de nuevo con curl, luego seed
node seed-data.js
```
