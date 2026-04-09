# ===== SPATAGONIA - Google Cloud Run =====
# Usar node:20-slim (NO alpine) - sharp necesita binarios Debian
FROM node:20-slim

WORKDIR /app

# Instalar dependencias del backend primero (cache de Docker)
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copiar todo el proyecto
COPY . .

# Cloud Run inyecta PORT automáticamente
ENV PORT=8080
ENV NODE_ENV=production

# El servidor está en /backend pero sirve ../ como estáticos
WORKDIR /app/backend

CMD ["node", "server.js"]
