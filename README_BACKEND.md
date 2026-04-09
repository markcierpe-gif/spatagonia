# Spatagonia - Sistema de Gestión de Modelos (Backend + Frontend)

## 📋 Descripción

Sistema completo de gestión de modelos/escorts con:
- **Backend:** Node.js + Express + PostgreSQL
- **Frontend:** HTML + CSS + JavaScript
- **Autenticación:** JWT (JSON Web Tokens)
- **Deployment:** Listo para Render ($7-8/mes)

---

## 🎯 Características

✅ **Autenticación:**
- Registro de usuarios
- Login con email/contraseña
- Tokens JWT para sesiones seguras

✅ **Gestión de Modelos:**
- Crear, leer, actualizar, eliminar (CRUD)
- Subida de fotos (Base64)
- Información completa: nombre, ubicación, descripción, servicios
- Estado "en línea" con indicador visual
- Datos compartidos entre todos los usuarios

✅ **Responsive:**
- Funciona en móvil, tablet y desktop
- Menú lateral desplegable
- Botones flotantes WhatsApp/teléfono

---

## 📁 Estructura del Proyecto

```
sex patagonia/
├── backend/                    # Servidor Node.js
│   ├── config/
│   │   └── db.js              # Configuración PostgreSQL
│   ├── middleware/
│   │   └── auth.js            # Verificación JWT
│   ├── routes/
│   │   ├── auth.js            # Login/registro
│   │   └── models.js          # CRUD de modelos
│   ├── server.js              # Express app
│   ├── package.json           # Dependencias
│   ├── .env.example           # Template de variables
│   └── .gitignore             # Archivos a ignorar
│
├── Frontend (Root)
│   ├── index.html             # Página principal
│   ├── login.html             # Login/registro
│   ├── styles.css             # Estilos
│   ├── script.js              # Lógica del cliente
│   ├── data.js                # Utilidades (legacy)
│
├── SETUP_LOCAL.md             # Instrucciones setup local
├── DEPLOYMENT.md              # Guía de deployment
├── Procfile                   # Para Render
├── .gitignore                 # Archivos ignorar
└── README.md                  # Este archivo
```

---

## 🚀 Quick Start (Local)

```bash
# 1. Instalar dependencias
cd backend && npm install && cd ..

# 2. Configurar .env
cp backend/.env.example backend/.env
# Editar backend/.env con tus datos

# 3. Crear base de datos PostgreSQL
createdb spatagonia

# 4. Iniciar backend (terminal 1)
cd backend && npm run dev

# 5. Iniciar frontend (terminal 2)
python -m http.server 8000

# 6. Abrir navegador
# Login: http://localhost:8000/login.html
# App: http://localhost:8000/index.html
```

Ver `SETUP_LOCAL.md` para detalles completos.

---

## 🌐 API Endpoints

### Autenticación
```
POST /api/auth/register
  Body: { email, password }
  Response: { token, user }

POST /api/auth/login
  Body: { email, password }
  Response: { token, user }
```

### Modelos (Requieren Token)
```
GET /api/models
  Headers: { Authorization: "Bearer TOKEN" }
  Response: [{ id, nombre, ubicacion, ... }]

GET /api/models/public/all
  Response: [{ ... }] (sin autenticación)

POST /api/models
  Body: { nombre, ubicacion, descripcion, ... }
  Response: { model }

PUT /api/models/:id
  Body: { campos a actualizar }
  Response: { model }

DELETE /api/models/:id
  Response: { message }
```

---

## 📦 Dependencias

### Backend
- **express** - Framework web
- **pg** - Cliente PostgreSQL
- **bcryptjs** - Hashing de contraseñas
- **jsonwebtoken** - Tokens JWT
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Variables de entorno

### Frontend
- Vanilla HTML/CSS/JavaScript (sin dependencias)

---

## 🗄️ Base de Datos

### Tabla: users
```sql
id: SERIAL PRIMARY KEY
email: VARCHAR(255) UNIQUE
password_hash: VARCHAR(255)
created_at: TIMESTAMP
```

### Tabla: models
```sql
id: SERIAL PRIMARY KEY
user_id: INTEGER (FK → users)
nombre: VARCHAR(255)
ubicacion: VARCHAR(255)
descripcion: TEXT
servicios: JSONB
foto: TEXT (base64)
en_linea: BOOLEAN
telefono: VARCHAR(20)
whatsapp: VARCHAR(20)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

---

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcryptjs
- ✅ JWT para autenticación stateless
- ✅ CORS configurado
- ✅ Validación de datos en backend
- ✅ Variables de entorno para secrets

---

## 💰 Costos (Render)

| Servicio | Costo |
|----------|-------|
| Node.js web service | $7/mes (o free) |
| PostgreSQL | $0/mes (gratuito) |
| Frontend static | $0/mes (gratuito) |
| **TOTAL** | **$0-7/mes** ✓ |

Completamente dentro de tu presupuesto de $8/mes

---

## 📚 Documentación

- **Setup Local:** `SETUP_LOCAL.md`
- **Deployment:** `DEPLOYMENT.md`
- **Frontend Original:** `README.md`

---

## 🚢 Deployment

1. Lee `SETUP_LOCAL.md` (instalar localmente)
2. Verifica que todo funciona localmente
3. Lee `DEPLOYMENT.md` (deployment a Render)
4. Sigue los pasos para deployar

---

## 🐛 Troubleshooting

**Backend no inicia:**
```bash
# Verifica PostgreSQL está corriendo
psql -U postgres
```

**Errores de conexión:**
- Verifica `.env` tiene los valores correctos
- PostgreSQL debe estar corriendo

**Frontend no funciona:**
- Verifica que backend está en http://localhost:5000
- Verifica URLs en `login.html` y `script.js`

---

## 📞 Soporte

Para problemas:
1. Revisa los logs en la terminal del backend: `npm run dev`
2. Revisa console del navegador: F12 → Console
3. Verifica que PostgreSQL está corriendo: `psql -U postgres`

---

## 🎉 Listo!

Tu aplicación está lista para:
- ✅ Desarrollo local
- ✅ Testing
- ✅ Deployment a producción

**Próximo paso:** Lee `SETUP_LOCAL.md` para empezar

---

**Versión:** 1.0  
**Última actualización:** 2026-04-08  
**Estado:** Producción lista ✓
