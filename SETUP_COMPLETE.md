# Setup Completo - Paso a Paso

## ✅ Fase 1: Instalar PostgreSQL

### Windows
1. Descarga: https://www.postgresql.org/download/windows/
2. Ejecuta el instalador
3. **Importante:**
   - Puerto: `5432` (dejar por defecto)
   - Usuario: `postgres`
   - Contraseña: `postgres` (o tu preferida, pero recuerda)
4. Termina la instalación

### Verificar instalación
Abre CMD/PowerShell y ejecuta:
```bash
psql -U postgres -c "SELECT version();"
```

Si ves la versión de PostgreSQL, ¡está correcto!

---

## ✅ Fase 2: Crear Base de Datos

Abre CMD/PowerShell y ejecuta:

```bash
# Conectarse a PostgreSQL
psql -U postgres

# En el prompt postgres=#, ejecuta esto:
CREATE DATABASE spatagonia;
\q
```

---

## ✅ Fase 3: Configurar .env

Abre: `C:\Users\Usuario\Desktop\sex patagonia\backend\.env`

Si no existe, copia desde `.env.example`:
```
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spatagonia
PORT=5000
NODE_ENV=development
JWT_SECRET=secret_local_key_change_later
FRONTEND_URL=http://localhost:8000
```

**⚠️ Cambia `DB_PASSWORD` si usaste otra contraseña en PostgreSQL**

---

## ✅ Fase 4: Iniciar Backend

Abre **Terminal 1** (CMD/PowerShell):

```bash
cd "C:\Users\Usuario\Desktop\sex patagonia\backend"
npm run dev
```

Deberías ver:
```
✓ Conectado a PostgreSQL
✓ Tabla users lista
✓ Tabla models lista
✓ Servidor corriendo en http://localhost:5000
```

---

## ✅ Fase 5: Crear Usuario de Prueba

Abre **Terminal 2** (CMD/PowerShell):

```bash
# Registrar usuario con credenciales específicas
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"cierpeh@gmail.com\",\"password\":\"Marco1981@\"}"
```

Deberías ver una respuesta con un `token`. **Copia el token, lo usaremos después.**

Si en Windows da error con comillas, usa esto:
```bash
$body = '{"email":"cierpeh@gmail.com","password":"Marco1981@"}'
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d $body
```

**Credenciales de acceso:**
- Email: `cierpeh@gmail.com`
- Contraseña: `Marco1981@`

---

## ✅ Fase 6: Llenar con Fotos y Datos

En **Terminal 2** (la que usaste para curl), ejecuta:

```bash
cd "C:\Users\Usuario\Desktop\sex patagonia\backend"
node seed-data.js
```

Verás algo como:
```
🌱 Iniciando seed de datos...

✓ Encontrados 1 usuario(s)
✓ 1. VALENTINA LATINA (Punta Arenas) 🟢 En línea
✓ 2. PAOLITA Y NICOLE (Puerto Natales) 🟢 En línea
✓ 3. LORENA APRETADITA (Porvenir) ⚫ Offline
...
✅ Completado: 20 modelos creados
```

---

## ✅ Fase 7: Iniciar Frontend

Abre **Terminal 3** (CMD/PowerShell):

```bash
cd "C:\Users\Usuario\Desktop\sex patagonia"
python -m http.server 8000
```

Deberías ver:
```
Serving HTTP on 0.0.0.0 port 8000 ...
```

---

## ✅ Fase 8: Abre el Navegador

1. Ve a: **http://localhost:8000/login.html**
2. Haz clic en "Iniciar Sesión"
3. Ingresa las credenciales:
   - Email: `cierpeh@gmail.com`
   - Contraseña: `Marco1981@`
4. Se redirige automáticamente a **http://localhost:8000/index.html**

---

## 🎉 ¡Listo!

Deberías ver:
- **20 tarjetas de modelos** con fotos
- **Nombres, ubicaciones, estados** de cada modelo
- **Botones WhatsApp y teléfono** funcionales
- **Indicadores en línea** (verde/gris)
- Puedes crear, editar y eliminar modelos

---

## 📋 Checklist Final

- [ ] PostgreSQL instalado
- [ ] Base de datos `spatagonia` creada
- [ ] `.env` configurado
- [ ] Backend corriendo (`npm run dev`)
- [ ] Usuario de prueba creado (curl)
- [ ] Seed ejecutado (`node seed-data.js`)
- [ ] Frontend corriendo (`python -m http.server 8000`)
- [ ] Login funciona
- [ ] Ves 20 modelos con fotos

---

## 🆘 Troubleshooting

### Error: "Cannot connect to PostgreSQL"
```bash
psql -U postgres -c "SELECT 1"
```
Si no funciona, PostgreSQL no está corriendo. Reinicia PostgreSQL.

### Error: "EADDRINUSE: address already in use :::5000"
Puerto 5000 ya está en uso. Mata el proceso:
```bash
# En PowerShell (Windows):
Get-Process -Name node | Stop-Process -Force
```

### Error en seed-data.js
Asegúrate que:
- El usuario está creado (curl debe devolver un token)
- Las fotos están en la carpeta raíz

### Las fotos no se ven
Las fotos se guardan como base64 en la BD. Pueden tardar en cargar. Recarga la página.

---

## 📞 URLs Importantes

- **Login:** http://localhost:8000/login.html
- **App:** http://localhost:8000/index.html
- **Backend Health:** http://localhost:5000/health
- **API Modelos:** http://localhost:5000/api/models (requiere token)

---

## 💡 Notas

- Los datos se guardan en PostgreSQL
- Al recargar la página, los datos persisten
- Cada usuario solo ve sus modelos (excepto endpoint /public/all)
- Las fotos son base64, pueden tardar en cargar inicialmente

¡Disfruta tu demostración! 🎉
