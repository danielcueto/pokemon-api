# Pokémon API

API REST desarrollada con [NestJS](https://nestjs.com/) para gestionar información sobre Pokémon, Entrenadores y Tipos. Utiliza TypeORM como ORM y PostgreSQL como base de datos.

## Descripción

Esta API proporciona endpoints para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre las siguientes entidades:

*   **Pokémons:** Gestionar datos individuales de Pokémon.
*   **Trainers:** Gestionar datos de entrenadores Pokémon.
*   **Types:** Gestionar los diferentes tipos de Pokémon (Fuego, Agua, Planta, etc.).

## Prerrequisitos

Antes de empezar, asegúrate de tener instalado lo siguiente:

*   [Node.js](https://nodejs.org/) (Se recomienda la versión LTS)
*   npm (Normalmente viene con Node.js) o yarn
*   [PostgreSQL](https://www.postgresql.org/)

## Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd pokemon-api
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    # o si usas yarn:
    # yarn install
    ```

3.  **Configura la base de datos:**
    *   Asegúrate de tener una instancia de PostgreSQL en ejecución.
    *   Crea una base de datos para la aplicación (p. ej., `pokemon_db`).
    *   Ejecuta el script SQL proporcionado en `database.sql` para crear las tablas necesarias en la base de datos que acabas de crear.
    *   **Importante:** Revisa la configuración de conexión a la base de datos. Es probable que necesites crear un archivo `.env` en la raíz del proyecto para especificar las credenciales de la base de datos (host, puerto, usuario, contraseña, nombre de la base de datos), basándote en cómo esté configurado `DatabaseModule` en `src/database/database.module.ts`. Un ejemplo de archivo `.env` podría ser:
      ```env
      DB_HOST=localhost
      DB_PORT=5432
      DB_USERNAME=tu_usuario_postgres
      DB_PASSWORD=tu_contraseña_postgres
      DB_DATABASE=pokemon_db
      ```
      *Nota: Asegúrate de que el `DatabaseModule` esté configurado para leer estas variables de entorno.*

## Ejecutar la Aplicación

1.  **Modo de Desarrollo (con recarga automática):**
    ```bash
    npm run start:dev
    ```
    La aplicación estará disponible en `http://localhost:3000` (o el puerto configurado).

2.  **Compilar para Producción:**
    ```bash
    npm run build
    ```

3.  **Ejecutar en Modo Producción:**
    ```bash
    npm run start:prod
    ```

## Ejecutar Pruebas

1.  **Pruebas Unitarias:**
    ```bash
    npm run test
    ```

2.  **Pruebas End-to-End (E2E):**
    *   Asegúrate de que la aplicación (o una instancia de prueba) esté en ejecución y la base de datos de prueba configurada.
    ```bash
    npm run test:e2e
    ```

3.  **Cobertura de Pruebas:**
    ```bash
    npm run test:cov
    ```
    Se generará un informe de cobertura en la carpeta `coverage`.

## Documentación de la API (Swagger)

Si la configuración de Swagger está habilitada (como sugiere la dependencia `@nestjs/swagger`), puedes acceder a la documentación interactiva de la API (generalmente) en la siguiente ruta una vez que la aplicación esté en ejecución:

`http://localhost:3000/api`

Esta interfaz te permitirá ver todos los endpoints disponibles, sus parámetros, y probarlos directamente desde el navegador.

## Estructura del Proyecto (Resumen)

*   `src/`: Contiene el código fuente principal de la aplicación.
    *   `main.ts`: Punto de entrada de la aplicación.
    *   `app.module.ts`: Módulo raíz de la aplicación.
    *   `database/`: Configuración del módulo de base de datos.
    *   `pokemons/`: Módulo para la gestión de Pokémon (controlador, servicio, DTOs, entidad).
    *   `trainers/`: Módulo para la gestión de Entrenadores.
    *   `types/`: Módulo para la gestión de Tipos de Pokémon.
*   `test/`: Contiene las pruebas E2E.
*   `database.sql`: Script para inicializar la estructura de la base de datos.

## Licencia

Este proyecto está bajo la licencia UNLICENSED (según `package.json`).
