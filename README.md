# Todo App Backend - Gestión de Tareas

Una aplicación para gestionar tareas (crear, ver, editar y eliminar) construida con Node.js, Express y PostgreSQL.

---

## Tabla de Contenidos

1. [Qué hace esta aplicación](#qué-hace-esta-aplicación)
2. [Requisitos previos](#requisitos-previos)
3. [Instalación paso a paso](#instalación-paso-a-paso)
4. [Cómo ejecutar la aplicación](#cómo-ejecutar-la-aplicación)
5. [Estructura del proyecto](#estructura-del-proyecto)
6. [Cómo funciona la aplicación](#cómo-funciona-la-aplicación)
7. [Rutas disponibles (Endpoints)](#rutas-disponibles-endpoints)
8. [Validaciones implementadas](#validaciones-implementadas)
9. [Manejo de errores](#manejo-de-errores)
10. [Clases y componentes del proyecto](#clases-y-componentes-del-proyecto)

---

## Qué hace esta aplicación

Esta es una aplicación de "lista de tareas" (To-Do List) que permite:

- **Ver** todas las tareas guardadas
- **Ver** una tarea específica por su número identificador
- **Crear** nuevas tareas con título y descripción
- **Actualizar** tareas existentes (cambiar título, descripción o marcar como completada)
- **Eliminar** tareas que ya no necesitas

Es como tener una libreta digital donde puedes anotar tus pendientes y organizarlos.

---

## Requisitos previos

Antes de instalar, necesitas tener instalado en tu computadora:

1. **Node.js** (versión 18 o superior)
   - Es el programa que permite ejecutar JavaScript fuera del navegador
   - Descárgalo desde: https://nodejs.org

2. **PostgreSQL** (base de datos)
   - Es donde se guardarán todas las tareas
   - Descárgalo desde: https://www.postgresql.org/download/
   - También puedes usar servicios en la nube como Supabase, Railway, etc.

3. **Un editor de código** (opcional pero recomendado)
   - Visual Studio Code, Cursor, o similar

---

## Instalación paso a paso

### Paso 1: Descargar el proyecto

Si tienes el proyecto en una carpeta, ábrela. Si lo descargaste de un repositorio:

```bash
git clone <url-del-repositorio>
cd prueba_tecnica
```

### Paso 2: Instalar las dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto descargará todas las librerías necesarias que el proyecto usa:
- **express**: Para crear el servidor web
- **pg**: Para conectarse a PostgreSQL
- **cors**: Para permitir peticiones desde otras aplicaciones
- **dotenv**: Para manejar configuraciones secretas
- **typescript**: Para usar TypeScript (JavaScript mejorado)

### Paso 3: Configurar la base de datos

1. Crea un archivo llamado `.env` en la raíz del proyecto (donde está el `package.json`)

2. Agrega la siguiente línea con tus datos de PostgreSQL:

```
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_base_datos
PORT=3001
```

Reemplaza:
- `usuario`: Tu usuario de PostgreSQL (generalmente "postgres")
- `contraseña`: Tu contraseña de PostgreSQL
- `nombre_base_datos`: El nombre de la base de datos que crearás

3. Crea la base de datos en PostgreSQL:

```sql
CREATE DATABASE nombre_base_datos;
```

4. Ejecuta la migración para crear la tabla de tareas. Conéctate a tu base de datos y ejecuta:

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## Cómo ejecutar la aplicación

### Modo desarrollo (recomendado mientras trabajas)

```bash
npm run dev
```

Esto inicia el servidor y se reinicia automáticamente cuando haces cambios en el código.

### Modo producción

Primero compila el proyecto:

```bash
npm run build
```

Luego ejecútalo:

```bash
npm start
```

### Verificar que funciona

Una vez iniciado, abre tu navegador y visita:

```
http://localhost:3001/ping
```

Si ves `{"message": "pong"}`, ¡todo está funcionando correctamente!

---

## Estructura del proyecto

```
prueba_tecnica/
├── src/                        # Código fuente de la aplicación
│   ├── app.ts                  # Configuración principal de la app
│   ├── server.ts               # Punto de entrada (inicia el servidor)
│   ├── controllers/            # Controladores (reciben las peticiones)
│   │   └── tasks.controller.ts
│   ├── services/               # Servicios (lógica de negocio y validaciones)
│   │   └── task.service.ts
│   ├── repositories/           # Repositorios (comunicación con la base de datos)
│   │   └── tasks.repository.ts
│   ├── routes/                 # Rutas (definen las URLs disponibles)
│   │   └── tasks.routes.ts
│   ├── middlewares/            # Middlewares (funciones intermedias)
│   │   └── errors.middleware.ts
│   ├── db/                     # Configuración de base de datos
│   │   ├── index.ts
│   │   └── migrations/
│   │       └── 001_init.sql
│   └── utils/                  # Utilidades
│       └── http-error.ts
├── package.json                # Dependencias y scripts del proyecto
├── tsconfig.json               # Configuración de TypeScript
└── .gitignore                  # Archivos ignorados por Git
```

---

## Cómo funciona la aplicación

### El flujo de una petición (explicado de forma simple)

Imagina que quieres crear una nueva tarea. Esto es lo que pasa internamente:

```
TÚ (Usuario)
    │
    ▼
[1. RUTAS] ────────────────────────────────────────────────────────────
    │  Reciben tu petición y la dirigen al lugar correcto.
    │  Es como un recepcionista que te indica a qué oficina ir.
    ▼
[2. CONTROLADOR] ──────────────────────────────────────────────────────
    │  Recibe los datos que enviaste (título, descripción).
    │  Es como el empleado que toma tu solicitud.
    ▼
[3. SERVICIO] ─────────────────────────────────────────────────────────
    │  Verifica que los datos sean correctos (validaciones).
    │  Es como el supervisor que revisa que todo esté en orden.
    ▼
[4. REPOSITORIO] ──────────────────────────────────────────────────────
    │  Guarda la información en la base de datos.
    │  Es como el archivero que guarda tus documentos.
    ▼
[5. BASE DE DATOS] ────────────────────────────────────────────────────
    │  PostgreSQL almacena la tarea permanentemente.
    │  Es el archivero donde se guardan todos los registros.
    ▼
[RESPUESTA] ───────────────────────────────────────────────────────────
    La respuesta viaja de vuelta por el mismo camino hasta llegar a ti.
```

### Arquitectura en capas

El proyecto usa una arquitectura en capas, donde cada capa tiene una responsabilidad específica:

| Capa | Archivo | ¿Qué hace? |
|------|---------|------------|
| **Rutas** | `tasks.routes.ts` | Define las URLs que acepta la aplicación |
| **Controlador** | `tasks.controller.ts` | Recibe las peticiones y envía respuestas |
| **Servicio** | `task.service.ts` | Contiene las reglas del negocio y validaciones |
| **Repositorio** | `tasks.repository.ts` | Se comunica con la base de datos |

Esta separación permite que el código sea más ordenado y fácil de mantener.

---

## Rutas disponibles (Endpoints)

La URL base es: `http://localhost:3001/api/v1/tasks`

### 1. Obtener todas las tareas

```
GET /api/v1/tasks
```

**Respuesta exitosa:**
```json
{
  "data": {
    "tasks": [
      {
        "id": 1,
        "title": "Comprar leche",
        "description": "En el supermercado",
        "isCompleted": false,
        "createdAt": "2026-02-02T10:00:00.000Z"
      }
    ]
  }
}
```

### 2. Obtener una tarea específica

```
GET /api/v1/tasks/:id
```

**Ejemplo:** `GET /api/v1/tasks/1`

**Respuesta exitosa:**
```json
{
  "data": {
    "task": {
      "id": 1,
      "title": "Comprar leche",
      "description": "En el supermercado",
      "isCompleted": false,
      "createdAt": "2026-02-02T10:00:00.000Z"
    }
  }
}
```

### 3. Crear una nueva tarea

```
POST /api/v1/tasks
```

**Cuerpo de la petición:**
```json
{
  "title": "Estudiar para el examen",
  "description": "Capítulos 1 al 5"
}
```

**Respuesta exitosa (código 201):**
```json
{
  "data": {
    "task": {
      "id": 2,
      "title": "Estudiar para el examen",
      "description": "Capítulos 1 al 5",
      "isCompleted": false,
      "createdAt": "2026-02-02T11:00:00.000Z"
    }
  }
}
```

### 4. Actualizar una tarea

```
PUT /api/v1/tasks/:id
```

**Ejemplo:** `PUT /api/v1/tasks/1`

**Cuerpo de la petición:**
```json
{
  "title": "Comprar leche y pan",
  "description": "En el supermercado del centro",
  "isCompleted": true
}
```

**Respuesta exitosa:**
```json
{
  "data": {
    "task": {
      "id": 1,
      "title": "Comprar leche y pan",
      "description": "En el supermercado del centro",
      "isCompleted": true,
      "createdAt": "2026-02-02T10:00:00.000Z"
    }
  }
}
```

### 5. Eliminar una tarea

```
DELETE /api/v1/tasks/:id
```

**Ejemplo:** `DELETE /api/v1/tasks/1`

**Respuesta exitosa:**
```json
{
  "data": {
    "isDeleted": true
  }
}
```

---

## Validaciones implementadas

Las validaciones son comprobaciones que se hacen para asegurar que los datos sean correctos antes de guardarlos.

### Validación del título (title)

| Regla | Descripción | Mensaje de error |
|-------|-------------|------------------|
| **Obligatorio** | El título no puede estar vacío | "Title is required" |
| **Mínimo 3 caracteres** | Debe tener al menos 3 letras/números | "Title must be at least 3 characters long" |


## Manejo de errores

La aplicación maneja los errores de forma centralizada para dar respuestas claras y consistentes.

### Tipos de errores

| Código | Significado | Cuándo ocurre |
|--------|-------------|---------------|
| **400** | Solicitud incorrecta | Datos inválidos (ej: título muy corto) |
| **404** | No encontrado | La tarea que buscas no existe |
| **500** | Error del servidor | Algo falló internamente (ej: base de datos caída) |

### Cómo se manejan los errores

1. **Errores conocidos (HttpError)**: Son errores que esperamos que puedan pasar
   - Se devuelve el código y mensaje específico
   - Ejemplo: `{ "message": "Title is required" }` con código 400

2. **Errores desconocidos**: Son errores inesperados
   - Se devuelve un mensaje genérico por seguridad
   - Ejemplo: `{ "message": "Internal server error" }` con código 500
   - El error real se guarda en los registros del servidor para investigarlo

### Ejemplo de respuesta de error

```json
{
  "message": "Title must be at least 3 characters long"
}
```

---

## Clases y componentes del proyecto

### 1. TasksController (Controlador de tareas)

**Archivo:** `src/controllers/tasks.controller.ts`

**¿Qué hace?** Recibe las peticiones del usuario y coordina las respuestas.

**Funciones disponibles:**
- `getTasks`: Obtiene todas las tareas
- `getTaskById`: Obtiene una tarea por su ID
- `createTask`: Crea una nueva tarea
- `updateTask`: Actualiza una tarea existente
- `deleteTask`: Elimina una tarea

---

### 2. TaskService (Servicio de tareas)

**Archivo:** `src/services/task.service.ts`

**¿Qué hace?** Contiene la lógica del negocio y las validaciones.

**Funciones disponibles:**
- `validateTitle`: Verifica que el título sea válido (privada)
- `getTasks`: Obtiene todas las tareas
- `getTaskById`: Obtiene una tarea verificando que exista
- `createTask`: Valida y crea una nueva tarea
- `updateTask`: Valida y actualiza una tarea
- `deleteTask`: Elimina una tarea verificando que exista

---

### 3. TasksRepository (Repositorio de tareas)

**Archivo:** `src/repositories/tasks.repository.ts`

**¿Qué hace?** Se comunica directamente con la base de datos PostgreSQL.

**Funciones disponibles:**
- `findAll`: Busca todas las tareas en la base de datos
- `findById`: Busca una tarea específica por su ID
- `save`: Guarda una nueva tarea
- `update`: Actualiza una tarea existente
- `destroy`: Elimina una tarea de la base de datos

---

### 4. HttpError (Error HTTP personalizado)

**Archivo:** `src/utils/http-error.ts`

**¿Qué hace?** Representa un error con código de estado HTTP y mensaje.

**Uso:**
```typescript
throw new HttpError(400, "Title is required");
```

---

### 5. Task (Modelo de tarea)

**Archivo:** `src/repositories/tasks.repository.ts`

**¿Qué es?** La estructura de datos que representa una tarea.

**Campos:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | número | Identificador único (automático) |
| `title` | texto | Título de la tarea (obligatorio) |
| `description` | texto | Descripción detallada (opcional) |
| `isCompleted` | verdadero/falso | Si la tarea está completada |
| `createdAt` | fecha | Cuándo se creó (automático) |

---

## Tecnologías utilizadas

| Tecnología | Versión | ¿Para qué se usa? |
|------------|---------|-------------------|
| Node.js | 18+ | Ejecutar JavaScript en el servidor |
| TypeScript | 5.9 | JavaScript con tipos (menos errores) |
| Express | 5.2 | Crear el servidor web y las rutas |
| PostgreSQL | - | Base de datos para guardar las tareas |
| pg | 8.18 | Conectar Node.js con PostgreSQL |
| cors | 2.8 | Permitir peticiones desde otros orígenes |
| dotenv | 17.2 | Cargar configuraciones desde archivo .env |

---

## Comandos disponibles

| Comando | ¿Qué hace? |
|---------|------------|
| `npm install` | Instala todas las dependencias |
| `npm run dev` | Inicia el servidor en modo desarrollo |
| `npm run build` | Compila el proyecto para producción |
| `npm start` | Inicia el servidor compilado |

## Autor

Proyecto desarrollado como prueba técnica.
