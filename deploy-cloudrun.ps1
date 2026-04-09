# ============================================================
# SPATAGONIA - Deploy a Google Cloud Run
# Ejecutar en PowerShell desde la carpeta del proyecto:
#   .\deploy-cloudrun.ps1
# ============================================================

$PROJECT_ID = "sample-firebase-ai-app-127bd"
$SERVICE_NAME = "spatagonia"
$REGION = "us-central1"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SPATAGONIA - Deploy a Google Cloud Run" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ---- Pedir DATABASE_URL ----
Write-Host "Necesito la URL de tu base de datos PostgreSQL de Render." -ForegroundColor Yellow
Write-Host "La encuentras en: dashboard.render.com -> tu DB -> Connect -> External Database URL"
Write-Host ""
$DATABASE_URL = Read-Host "Pega aqui la DATABASE_URL de Render"

if ([string]::IsNullOrWhiteSpace($DATABASE_URL)) {
    Write-Host "ERROR: DATABASE_URL no puede estar vacia." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Autenticando con Google Cloud..." -ForegroundColor Green
gcloud auth login

Write-Host ""
Write-Host "Configurando proyecto: $PROJECT_ID" -ForegroundColor Green
gcloud config set project $PROJECT_ID

Write-Host ""
Write-Host "Habilitando APIs necesarias..." -ForegroundColor Green
gcloud services enable run.googleapis.com --project=$PROJECT_ID
gcloud services enable cloudbuild.googleapis.com --project=$PROJECT_ID
gcloud services enable artifactregistry.googleapis.com --project=$PROJECT_ID

Write-Host ""
Write-Host "Iniciando deploy (esto tarda 3-5 minutos)..." -ForegroundColor Green
Write-Host ""

gcloud run deploy $SERVICE_NAME `
  --source . `
  --region $REGION `
  --platform managed `
  --allow-unauthenticated `
  --memory 512Mi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 3 `
  --port 8080 `
  --set-env-vars="NODE_ENV=production" `
  --set-env-vars="DATABASE_URL=$DATABASE_URL" `
  --set-env-vars="JWT_SECRET=spatagonia_jwt_secret_cloudrun_2026" `
  --set-env-vars="ADMIN_EMAIL=cierpeh@gmail.com" `
  --set-env-vars="ADMIN_PASS=Marco1981@" `
  --set-env-vars="SEED_KEY=spatagonia2026" `
  --project=$PROJECT_ID

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  DEPLOY EXITOSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tu sitio esta disponible en la URL que aparece arriba." -ForegroundColor Green
    Write-Host "Copia esa URL y enviamela para actualizar el codigo." -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ERROR en el deploy. Copia el mensaje de error y enviamelo." -ForegroundColor Red
}
