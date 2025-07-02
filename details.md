# Dockerización del Proyecto Pokemon API

## ¿Qué hice?

He creado un sistema de contenedores Docker para tu proyecto Pokemon API de manera simple y directa. El objetivo es que puedas desplegar fácilmente tu aplicación NestJS junto con su base de datos PostgreSQL sin complicaciones.

## Archivos Creados

### 1. Dockerfile
Este archivo define cómo se construye la imagen de tu aplicación NestJS. Empiezo con una imagen base de Node.js versión 20 que es ligera (alpine). Luego copio los archivos de dependencias, instalo las librerías necesarias, copio todo el código fuente, construyo la aplicación y finalmente expongo el puerto 3000 donde corre la API. El comando final ejecuta la versión de producción de tu aplicación.

### 2. docker-compose.yml
Este es el archivo principal que orquesta todo. Define dos servicios: uno para PostgreSQL y otro para tu API. El servicio de PostgreSQL usa la imagen oficial de Postgres 15, configura la base de datos con el nombre "pokemondb", usuario "postgres" y contraseña "123777" que vi en tu código. También monta el archivo database.sql para que se ejecute automáticamente al iniciar. El servicio de la API construye tu aplicación usando el Dockerfile y la conecta con la base de datos.

### 3. .dockerignore
Este archivo le dice a Docker qué archivos ignorar al construir la imagen. Excluyo cosas como node_modules, archivos de git, documentación y archivos de testing para hacer la imagen más liviana y segura.

### 4. Modificación en database.module.ts
Cambié la configuración de la base de datos para que use variables de entorno en lugar de valores hardcodeados. Esto permite que la aplicación se conecte automáticamente a la base de datos del contenedor cuando se ejecuta en Docker, pero sigue funcionando localmente con valores por defecto.

## Explicación Detallada de cada Instrucción

### Dockerfile - Instrucción por Instrucción

```dockerfile
FROM node:20.11.1-alpine3.19
```
**¿Qué hace?** Define la imagen base sobre la cual construir nuestra aplicación. Uso Node.js versión 20.11.1 con Alpine Linux porque es muy liviana (pocos MB vs cientos de MB de Ubuntu).

```dockerfile
WORKDIR /app
```
**¿Qué hace?** Establece el directorio de trabajo dentro del contenedor. Todos los comandos siguientes se ejecutarán desde esta carpeta `/app`.

```dockerfile
COPY package*.json ./
```
**¿Qué hace?** Copia solo los archivos `package.json` y `package-lock.json` al contenedor. Los copio primero (antes que el código) para aprovechar el cache de Docker. Si el código cambia pero las dependencias no, Docker reutiliza esta capa.

```dockerfile
RUN npm ci --only=production
```
**¿Qué hace?** Instala las dependencias de producción. Uso `npm ci` en lugar de `npm install` porque es más rápido y confiable para entornos de producción. `--only=production` evita instalar dependencias de desarrollo que no necesitamos.

```dockerfile
COPY . .
```
**¿Qué hace?** Copia todo el código fuente de tu proyecto al contenedor. Se hace después de instalar dependencias para optimizar el cache de Docker.

```dockerfile
RUN npm run build
```
**¿Qué hace?** Ejecuta el comando de construcción de NestJS que compila el TypeScript a JavaScript y genera la carpeta `dist/` con el código optimizado para producción.

```dockerfile
EXPOSE 3000
```
**¿Qué hace?** Informa que el contenedor escuchará en el puerto 3000. Es más documentación que funcionalidad - no abre el puerto automáticamente.

```dockerfile
CMD ["npm", "run", "start:prod"]
```
**¿Qué hace?** Define el comando que se ejecuta cuando el contenedor inicia. Ejecuta la versión de producción de tu aplicación NestJS.

### docker-compose.yml - Instrucción por Instrucción

```yaml
version: '3.8'
```
**¿Qué hace?** Especifica la versión del formato de docker-compose que estamos usando. La 3.8 es estable y tiene todas las características que necesitamos.

```yaml
services:
```
**¿Qué hace?** Define el inicio de la sección donde describimos todos los contenedores que queremos ejecutar.

#### Servicio PostgreSQL:

```yaml
postgres:
  image: postgres:15-alpine
```
**¿Qué hace?** Define un servicio llamado "postgres" usando la imagen oficial de PostgreSQL versión 15 con Alpine Linux.

```yaml
container_name: pokemon-db
```
**¿Qué hace?** Le da un nombre específico al contenedor. Sin esto, docker-compose generaría un nombre automático como "proyecto_postgres_1".

```yaml
environment:
  POSTGRES_DB: pokemondb
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: 123777
```
**¿Qué hace?** Configura variables de entorno que PostgreSQL usa para inicializarse: crea la base de datos "pokemondb", usuario "postgres" con contraseña "123777".

```yaml
ports:
  - "5432:5432"
```
**¿Qué hace?** Mapea el puerto 5432 del contenedor al puerto 5432 de tu máquina. Esto permite conectarte a la base de datos desde fuera del contenedor.

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
  - ./database.sql:/docker-entrypoint-initdb.d/init.sql
```
**¿Qué hace?** Crea dos montajes: uno para persistir los datos de la base de datos (para que no se pierdan al reiniciar) y otro para ejecutar automáticamente tu script SQL al inicializar.

```yaml
restart: unless-stopped
```
**¿Qué hace?** Configura que el contenedor se reinicie automáticamente si falla, excepto si lo paras manualmente.

#### Servicio API:

```yaml
api:
  build: .
```
**¿Qué hace?** Define el servicio de tu API y le dice que construya la imagen usando el Dockerfile del directorio actual.

```yaml
environment:
  PORT: 3000
  DB_HOST: postgres
  DB_PORT: 5432
  # ... más variables
```
**¿Qué hace?** Configura variables de entorno que tu aplicación NestJS usará para conectarse a la base de datos. Nota que `DB_HOST: postgres` usa el nombre del servicio PostgreSQL.

```yaml
depends_on:
  - postgres
```
**¿Qué hace?** Le dice a docker-compose que inicie primero el contenedor de PostgreSQL antes que el de la API.

```yaml
volumes:
  postgres_data:
```
**¿Qué hace?** Define un volumen nombrado para persistir los datos de PostgreSQL.

## ¿Por qué existen ambos archivos?

### Dockerfile
**Propósito:** Define cómo construir UNA imagen de contenedor específicamente para tu aplicación.
**Analogía:** Es como una receta que dice "toma Node.js, agrega mi código, compílalo y prepáralo para ejecutar".
**Enfoque:** Se centra en una sola aplicación.

### docker-compose.yml
**Propósito:** Orquesta MÚLTIPLES contenedores y define cómo interactúan entre sí.
**Analogía:** Es como el director de una orquesta que coordina todos los músicos (contenedores) para tocar en armonía.
**Enfoque:** Se centra en todo el sistema (API + Base de datos + redes + volúmenes).

## ¿Para qué sirve cada uno?

### Dockerfile es para:
- Definir el ambiente de tu aplicación
- Instalar dependencias específicas
- Configurar el proceso de construcción
- Optimizar la imagen para producción
- Crear una imagen que se pueda reutilizar

### docker-compose.yml es para:
- Ejecutar múltiples servicios juntos
- Configurar comunicación entre contenedores
- Manejar variables de entorno por servicio
- Gestionar volúmenes y persistencia de datos
- Definir redes y puertos
- Facilitar el desarrollo local

## En resumen
Necesitas ambos porque el Dockerfile te permite crear la imagen de tu aplicación, y docker-compose te permite ejecutar esa aplicación junto con PostgreSQL de manera coordinada. Sin el Dockerfile no tendrías una imagen de tu API, y sin docker-compose tendrías que ejecutar y conectar manualmente cada contenedor.

## Cómo funciona todo junto

Cuando ejecutas `docker-compose up`, primero se levanta la base de datos PostgreSQL y automáticamente ejecuta el script database.sql que tienes para crear las tablas e insertar datos iniciales. Luego se construye y levanta tu aplicación NestJS, que se conecta automáticamente a la base de datos usando las variables de entorno configuradas.

## Para usar este setup

Solo necesitas ejecutar un comando: `docker-compose up --build` desde la carpeta de tu proyecto. Docker se encarga de todo: instalar dependencias, construir la aplicación, levantar la base de datos, y conectar ambos servicios. Tu API estará disponible en http://localhost:3000 y la documentación Swagger en http://localhost:3000/docs.

## Beneficios de esta implementación

La ventaja de esta configuración es que es totalmente portable. Cualquier persona puede clonar tu repositorio y ejecutar la aplicación completa sin instalar Node.js, PostgreSQL ni configurar nada manualmente. Docker se encarga de crear un ambiente aislado y consistente. Además, los datos de la base de datos se persisten en un volumen, por lo que no se pierden al reiniciar los contenedores.
