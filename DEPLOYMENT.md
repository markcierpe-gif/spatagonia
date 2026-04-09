# Guía de Deployment: Spatagonia a Render

## 🚀 Setup Local (Antes de Deployar)

### Requisitos
- Node.js 16+ instalado
- PostgreSQL 12+ instalado localmente
- Git instalado

### Pasos 1: Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### Pasos 2: Configurar Variables de Entorno

Copia `.env.example` a `.env` y edita:

```bash
cp .env.example .env
```

Edita `.env`:
```
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spatagonia

PORT=5000
NODE_ENV=development
JWT_SECRET=tu_secret_key_super_seguro
FRONTEND_URL=http://localhost:8000
```

### Pasos 3: Crear Base de Datos PostgreSQL

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE spatagonia;

# Salir
\q
```

### Pasos 4: Iniciar Backend Localmente

```bash
# En la carpeta backend/
npm run dev
```

Deberías ver:
```
✓ Conectado a PostgreSQL
✓ Tabla users lista
✓ Tabla models lista
✓ Índices creados
✓ Servidor corriendo en http://localhost:5000
```

### Pasos 5: Iniciar Frontend Localmente

En otra terminal:
```bash
cd ..
python -m http.server 8000
```

### Pasos 6: Probar la Aplicación

1. Abre `http://localhost:8000/login.html`
2. Regístrate con email/password
3. Se redirige a `http://localhost:8000/index.html`
4. Agreg modelos - todo funciona con datos compartidos en PostgreSQL

---

## 🌐 Deployment en Render

### Pasos 1: Preparar Repositorio Git

```bash
# En la raíz del proyecto
git init
git add .
git commit -m "Initial commit: Spatagonia con backend"
git branch -M main
```

Conectar con GitHub:
```bash
git remote add origin https://github.com/tu_usuario/tu_repo.git
git push -u origin main
```

### Pasos 2: Crear Cuenta en Render

1. Ve a https://render.com
2. Sign up con GitHub (más fácil)
3. Conecta tu repositorio

### Pasos 3: Crear Servicio Node.js en Render

1. Dashboard → New → Web Service
2. Conecta tu repositorio
3. Configuración:
   - **Name:** `spatagonia-api`
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `node backend/server.js`
   - **Region:** Elige la más cercana
   - **Plan:** Free (o Starter $7/mes si quieres más confiabilidad)

4. Scroll down → Environment Variables → Add
   ```
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_HOST=your_postgres_host
   DB_PORT=5432
   DB_NAME=spatagonia
   JWT_SECRET=random_secret_key_very_secure
   FRONTEND_URL=https://tu_dominio_frontend.com
   NODE_ENV=production
   PORT=10000
   ```

5. Click "Create Web Service"

### Pasos 4: Crear Base de Datos PostgreSQL en Render

1. Dashboard → New → PostgreSQL
2. Configuración:
   - **Name:** `spatagonia-db`
   - **Database:** spatagonia
   - **User:** postgres
   - **Region:** Misma que el servicio Node.js
   - **Plan:** Free (gratuito)

3. Click "Create Database"

4. Copia los valores de conexión y actualiza en el servicio Node.js las variables de entorno:
   ```
   DB_HOST=xxx.render.com
   DB_USER=postgres
   DB_PASSWORD=xxx
   DB_PORT=5432
   ```

### Pasos 5: Deployar Frontend Estático

Opción A: Usar Render para frontend también
1. Dashboard → New → Static Site
2. Conecta tu repositorio
3. **Build Command:** Leave empty (es estático)
4. **Publish Directory:** `.` (raíz del proyecto)

Opción B: Usar Netlify (más recomendado para static)
1. Ve a https://netlify.com
2. Conecta tu repo de GitHub
3. Deploy automático

### Pasos 6: Actualizar URLs en Frontend

Una vez deployado, actualiza el API_URL en login.html y script.js:

```javascript
// Cambiar de:
const API_URL = 'http://localhost:5000/api';

// A:
const API_URL = 'https://tu_api.onrender.com/api';
```

---

## 📊 Costos Finales en Render

| Servicio | Plan | Precio |
|----------|------|--------|
| Web Service (Node.js) | Free o Starter | $0-7/mes |
| PostgreSQL | Free | $0/mes |
| **TOTAL** | | **$0-7/mes** ✓ |

---

## 🔗 URLs Finales

Después del deployment:
- **Frontend:** `https://tu_frontend.com`
- **Backend API:** `https://tu_api.onrender.com`
- **Login:** `https://tu_frontend.com/login.html`

---

## ✅ Verificar Deployment

### Test Backend
```bash
curl https://tu_api.onrender.com/health
# Respuesta: {"status":"OK","message":"Servidor funcionando"}
```

### Test Login
1. Abre `https://tu_frontend.com/login.html`
2. Regístrate
3. Valida que datos se guardan en PostgreSQL

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'express'"
```bash
cd backend
npm install
```

### Error: "Database connection failed"
- Verifica que DB_HOST, DB_USER, DB_PASSWORD son correctos
- En Render, PostgreSQL tarda 1-2 min en estar listo

### Error: "CORS error"
- Actualiza `FRONTEND_URL` en environment variables del backend
- Asegúrate que el frontend hace requests a la URL correcta del backend

### Frontend no carga
- Si el frontend está en Render static, asegúrate que login.html apunta a la URL correcta del backend API

---

## 📝 Checklista de Deployment

- [ ] Backend funciona localmente
- [ ] PostgreSQL funciona localmente
- [ ] Frontend funciona localmente
- [ ] Repositorio Git creado
- [ ] Cuenta Render creada
- [ ] Servicio Node.js creado en Render
- [ ] PostgreSQL creado en Render
- [ ] Environment variables configuradas
- [ ] URLs actualizadas en frontend
- [ ] Frontend deployed (Render o Netlify)
- [ ] Login funciona en producción
- [ ] CRUD de modelos funciona
- [ ] Datos persisten en PostgreSQL

---

## 🎉 Listo!

Tu aplicación Spatagonia está desplegada y funcionando en producción con:
- ✅ Base de datos compartida
- ✅ Autenticación de usuarios
- ✅ CRUD de modelos
- ✅ Presupuesto: $0-7/mes

¿Necesitas ayuda? Revisa los logs en Render:
Dashboard → Tu servicio → Logs
