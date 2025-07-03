# GitHub Actions Workflows

## Workflows Configurados

### 1. Simple CI Pipeline (`simple-ci.yml`)
Pipeline básico que ejecuta en cada push/PR a main y develop:
- **Linting**: Verifica calidad del código
- **Tests**: Ejecuta pruebas unitarias
- **Build**: Construye la aplicación
- **Artifacts**: Sube el build compilado

### 2. Docker Build and Push (`docker-build.yml`)
Pipeline que construye y sube la imagen Docker a Docker Hub:
- **Build**: Construye la imagen Docker
- **Push**: Sube automáticamente a Docker Hub (solo en push a main)
- **Tags**: Crea tags con `latest` y el SHA del commit

## Configuración Requerida

Para que funcione el workflow de Docker, necesitas configurar estos secrets en GitHub:

1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Agrega estos secrets:
   - `DOCKERHUB_USERNAME`: Tu nombre de usuario de Docker Hub
   - `DOCKERHUB_TOKEN`: Token de acceso de Docker Hub

## Cómo crear el Docker Hub Token

1. Ve a [Docker Hub](https://hub.docker.com/)
2. **Settings** → **Security** → **New Access Token**
3. Copia el token y úsalo como `DOCKERHUB_TOKEN`

## Flujo de Trabajo

1. **Push a develop**: Solo ejecuta CI (tests y build)
2. **Push a main**: Ejecuta CI + construye y sube imagen Docker
3. **Pull Requests**: Solo ejecuta CI, no sube a Docker Hub

## Herramientas Utilizadas

- **GitHub Actions**: Plataforma de CI/CD
- **Node.js 20**: Runtime para la aplicación
- **Docker**: Para construir y subir imágenes
- **Docker Hub**: Registro de imágenes
