# GitHub Actions CI/CD Pipeline

## Descripción del Flujo

Este pipeline de GitHub Actions está diseñado para automatizar el proceso de integración continua y despliegue continuo (CI/CD) de la Pokemon API.

## Características del Pipeline

### ✅ Ejecuta pasos de prueba
- **Linting**: Verifica la calidad y consistencia del código
- **Unit Tests**: Ejecuta todas las pruebas unitarias
- **Coverage Tests**: Genera reportes de cobertura de código
- **E2E Tests**: Ejecuta pruebas end-to-end con base de datos PostgreSQL

### ✅ Push solo en main/develop
- El pipeline se activa automáticamente en:
  - Push a las ramas `main` y `develop`
  - Pull requests hacia estas ramas
- Los despliegues solo ocurren en pushes directos (no en PRs)

### ✅ Sube artefactos de construcción
- Genera y almacena los archivos compilados
- Incluye `dist/`, `package.json` y `package-lock.json`
- Los artefactos se mantienen por 30 días
- Nombrados con el SHA del commit para trazabilidad

## Herramientas Utilizadas

### Pipeline Tools
- **GitHub Actions**: Plataforma de CI/CD
- **Node.js**: Runtime y matriz de versiones (18.x, 20.x)
- **PostgreSQL**: Base de datos para pruebas
- **NPM**: Gestión de dependencias

### Services
- **PostgreSQL 15**: Servicio de base de datos para pruebas E2E

## Matriz de Pruebas

El pipeline ejecuta pruebas en múltiples versiones de Node.js:
- Node.js 18.x (LTS)
- Node.js 20.x (Current)

Esto asegura compatibilidad y detecta problemas potenciales en diferentes versiones.
