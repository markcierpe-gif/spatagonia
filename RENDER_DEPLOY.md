# Deployment en Render - Guía Rápida

## ⚡ Pasos para Deployar

### 1. Crear Repositorio GitHub

```bash
cd "C:\Users\Usuario\Desktop\sex patagonia"

# Inicializar Git
git init
git add .
git commit -m "Spatagonia v1.0 - Ready for production"

# Crear repo en GitHub y hacer push
git remote add origin https://github.com/tu_usuario/spatagonia.git
git branch -M main
git push -u origin main
```

### 2. Crear Cuenta en Render

1. Ve a https://render.com
2. Sign up con GitHub
3. Conecta tu repositorio

### 3. Crear PostgreSQL en Render

1. Dashboard → New → PostgreSQL
2. Nombre: `spatagonia-db`
3. Database: `spatagonia`
4. Plan: **Free**
5. Copia la connection string

### 4. Crear Web Service en Render

1. Dashboard → New → Web Service
2. Conecta tu repo GitHub `spatagonia`
3. Configuración:
   - **Name:** `spatagonia-api`
   - **Environment:** Node
   - **Region:** Elige la más cercana
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `node backend/server.js`
   - **Plan:** Free (o Starter $7/mes)

### 5. Agregar Variables de Entorno

En el Web Service, ve a **Environment**:

```
DB_USER=postgres
DB_PASSWORD=[copia del PostgreSQL]
DB_HOST=[copia del PostgreSQL]
DB_PORT=5432
DB_NAME=spatagonia
JWT_SECRET=your_secret_key_change_this_in_production_12345
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://tu_dominio_frontend.com
```

### 6. Deploy Backend

Click **Create Web Service** - Render deployará automáticamente

### 7. Crear Frontend Static Site

1. Dashboard → New → Static Site
2. Conecta tu repo
3. **Build Command:** leave empty
4. **Publish Directory:** `.` (raíz)

### 8. Actualizar Frontend URLs

Espera a que Render te dé la URL del backend (ej: `https://spatagonia-api.onrender.com`)

Luego, edita `login.html` y `script.js`:

Cambiar:
```javascript
const API_URL = 'http://localhost:5000/api';
```

A:
```javascript
const API_URL = 'https://spatagonia-api.onrender.com/api';
```

### 9. Crear Usuario Manual (una sola vez)

En Render, usa el terminal del Web Service:

```bash
# Acceder al terminal del web service
# Ejecutar curl para registrar usuario:
curl -X POST https://spatagonia-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"cierpeh@gmail.com","password":"Marco1981@"}'
```

### 10. Ejecutar Seed (Crear 20 modelos)

En el terminal del Web Service:

```bash
node backend/seed-final.js
```

---

## ✅ URLs Finales

- **Frontend:** https://spatagonia.onrender.com
- **Backend:** https://spatagonia-api.onrender.com
- **Login:** https://spatagonia.onrender.com/login.html

---

## 📊 Costos Render

| Servicio | Costo |
|----------|-------|
| Web Service (Node.js) | Free o $7/mes |
| PostgreSQL | Free (0.5GB) |
| Static Site | Free |
| **TOTAL** | **Free-$7/mes** ✓ |

---

## 🚨 Notas Importantes

1. **Imágenes:** Usando `https://via.placeholder.com/` (pública)
2. **JWT_SECRET:** Cambiar en Render a algo real y seguro
3. **PostgreSQL Free:** Limit de 0.5GB, suficiente para 20 modelos
4. **Auto-sleep:** Render suspende apps free después de 15min inactividad (se reactivan al acceder)

---

## ✨ Listo!

Una vez deployado, puedes acceder en:
- **https://spatagonia.onrender.com/login.html**
- Email: `cierpeh@gmail.com`
- Contraseña: `Marco1981@`

¡Disfruta tu sitio en producción! 🎉
