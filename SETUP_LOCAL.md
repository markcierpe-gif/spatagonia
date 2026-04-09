# Quick Setup: Spatagonia Localmente

## ⚡ Setup Rápido (15 minutos)

### 1️⃣ Instalar PostgreSQL

**Windows:**
- Descarga: https://www.postgresql.org/download/windows/
- Durante la instalación, recuerda la contraseña de `postgres`

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2️⃣ Crear Base de Datos

```bash
# Conectarse a PostgreSQL
psql -U postgres

# En el prompt, ejecutar:
CREATE DATABASE spatagonia;
\q
```

### 3️⃣ Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### 4️⃣ Configurar Variables de Entorno

```bash
cp .env.example .env
```

Edita `backend/.env` con tu información:
```
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_DE_POSTGRES
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spatagonia
PORT=5000
NODE_ENV=development
JWT_SECRET=secret_local_change_in_production
FRONTEND_URL=http://localhost:8000
```

### 5️⃣ Iniciar Backend

```bash
# En la carpeta backend/
npm run dev
```

Deberías ver:
```
✓ Conectado a PostgreSQL
✓ Servidor corriendo en http://localhost:5000
```

### 6️⃣ Iniciar Frontend (Nueva terminal)

```bash
# En la raíz del proyecto
python -m http.server 8000
```

### 7️⃣ Usar la App

1. Abre http://localhost:8000/login.html
2. Crea una cuenta (email + password)
3. Serás redirigido a index.html
4. Agrega modelos - los datos se guardan en PostgreSQL compartido

---

## 🧪 Probar APIs (Curl)

### Registrarse
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Copia el `token` de la respuesta

### Obtener Modelos
```bash
curl -X GET http://localhost:5000/api/models \
  -H "Authorization: Bearer TU_TOKEN"
```

### Crear Modelo
```bash
curl -X POST http://localhost:5000/api/models \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "nombre":"Mi Modelo",
    "ubicacion":"Punta Arenas",
    "descripcion":"Test",
    "telefono":"+56912345678",
    "servicios":["Video Call"],
    "en_linea":true
  }'
```

---

## 📋 Checklist

- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `spatagonia` creada
- [ ] `npm install` completado
- [ ] `.env` configurado
- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 8000
- [ ] Puedo registrarme en login.html
- [ ] Puedo ver/crear modelos

---

## 🆘 Troubleshooting

**Error: "connection refused"**
→ Verifica que PostgreSQL está corriendo: `psql -U postgres`

**Error: "Cannot find module"**
→ Ejecuta: `cd backend && npm install`

**Error: "EADDRINUSE: address already in use"**
→ Ya hay algo en ese puerto. Usa: `lsof -i :5000` para encontrar el proceso

**Password error en PostgreSQL**
→ Verifica `DB_PASSWORD` en `.env` coincide con tu password

---

## 🚀 Próximo Paso

Cuando todo funcione localmente, lee `DEPLOYMENT.md` para deployar a Render
