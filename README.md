# Proyecto Capstone Front

Sistema de gestión y análisis de estadísticas para equipos deportivos desarrollado con Astro, React, Solid.js y Tailwind CSS.

## Índice
## Índice

- [📋 Requisitos del Sistema](#-requisitos-del-sistema)
  - [Requisitos Obligatorios](#requisitos-obligatorios)
  - [Verificación de Requisitos](#verificación-de-requisitos)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [🚀 Estructura del Proyecto](#-estructura-del-proyecto)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
  - [Framework Principal](#framework-principal)
  - [UI Frameworks](#ui-frameworks)
  - [Estilos y CSS](#estilos-y-css)
  - [Desarrollo](#desarrollo)
  - [Testing y Calidad](#testing-y-calidad)
  - [Despliegue y Hosting](#despliegue-y-hosting)
  - [Herramientas Adicionales](#herramientas-adicionales)
- [🧞 Comandos](#-comandos)
  - [Comandos de Desarrollo](#comandos-de-desarrollo)
  - [Comandos de Build y Despliegue](#comandos-de-build-y-despliegue)
  - [Comandos de Testing](#comandos-de-testing)
  - [Comandos Utilitarios](#comandos-utilitarios)
- [🔐 Autenticación y Roles](#-autenticación-y-roles)
- [🧪 Testing](#-testing)
- [🌐 Despliegue](#-despliegue)
- [🆘 Solución de Problemas](#-solución-de-problemas)
  - [Errores con dependencias](#errores-con-dependencias)
  - [Errores de Node.js y versiones](#errores-de-nodejs-y-versiones)
  - [Errores de desarrollo](#errores-de-desarrollo)
  - [Errores de testing](#errores-de-testing)
  - [Problemas de memoria](#problemas-de-memoria)
  - [Problemas específicos del proyecto](#problemas-específicos-del-proyecto)
  - [Obtener ayuda adicional](#obtener-ayuda-adicional)
- [📚 Recursos](#-recursos)

## 📋 Requisitos del Sistema

Antes de ejecutar el proyecto, asegúrate de tener instalado:

### Requisitos Obligatorios

- **Node.js**: v18.0.0 o superior ([Descargar Node.js](https://nodejs.org/))
- **Yarn**: v1.22.0 o superior ([Instalar Yarn](https://yarnpkg.com/getting-started/install))
- **Git**: Para clonar el repositorio ([Descargar Git](https://git-scm.com/))

### Verificación de Requisitos

Puedes verificar que tienes las versiones correctas ejecutando:

```sh
node --version    # Debe mostrar v18.x.x o superior
yarn --version    # Debe mostrar 1.22.x o superior
git --version     # Para verificar que Git está instalado
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```sh
git clone <url-del-repositorio>
cd proyecto-capstone-front
```

### 2. Instalar dependencias

```sh
yarn install
```

```sh
yarn add astro
```

### 3. Configurar variables de entorno

Crea los archivos de entorno necesarios (si aplica):

```sh
cp .env.example .env.development  # Si existe archivo de ejemplo
```

### 4. Iniciar el servidor de desarrollo

```sh
yarn dev
```

El servidor estará disponible en: `http://localhost:4321`

## 🚀 Estructura del Proyecto

```text
📁 proyecto-capstone-front/
├── 📄 Archivos de configuración
│   ├── astro.config.mjs       # Configuración de Astro
│   ├── tsconfig.json           # Configuración de TypeScript
│   ├── package.json            # Dependencias del proyecto
│   ├── yarn.lock               # Lockfile de Yarn
│   ├── vitest.config.ts        # Configuración de Vitest
│   ├── vitest.setup.ts         # Setup de pruebas
│   ├── netlify.toml            # Configuración de Netlify
│   ├── env.d.ts                # Tipos de TypeScript
│   └── middleware.ts           # Middleware de autenticación
│
├── 📁 src/ (código fuente)
│   ├── 📁 pages/
│   │   ├── index.astro                    # Página principal
│   │   ├── AccessDenied.astro            # Página de acceso denegado
│   │   ├── NotFound.astro                # Página 404
│   │   │
│   │   ├── 📁 auth/
│   │   │   └── login.astro               # Página de login
│   │   │
│   │   └── 📁 equipo/
│   │       ├── equipos.astro             # Lista de equipos
│   │       ├── udla.astro                # Equipo UDLA
│   │       ├── udla2.astro               # Equipo UDLA 2
│   │       │
│   │       └── 📁 jugadores/
│   │           ├── analisis-video.astro        # Análisis de video
│   │           ├── estadisticas.astro          # Estadísticas generales
│   │           ├── registrar-jugador.astro     # Registro de jugadores
│   │           │
│   │           ├── 📁 jugador/
│   │           │   └── [id].astro              # Perfil de jugador
│   │           │
│   │           └── 📁 heatmap/
│   │               └── [id].astro              # Mapa de calor
│   │
│   ├── 📁 components/          # Componentes reutilizables (React/Solid)
│   ├── 📁 consts/              # Constantes (roles, rutas)
│   └── 📁 layouts/             # Layouts de página
│
├── 📁 tests/                   # Pruebas unitarias
│
├── 📁 public/                  # Assets estáticos
│   └── favicon.svg
│
├── 📁 dist/                    # Build de producción
│
└── 📁 node_modules/            # Dependencias (no versionar)
```

## 🛠️ Stack Tecnológico

### Framework Principal
- **Astro**: v5.14.5 - Framework web moderno para sitios rápidos

### UI Frameworks
- **React**: v19.2.0 - Para componentes interactivos
- **Solid.js**: v1.9.9 - Framework reactivo de alto rendimiento

### Estilos y CSS
- **Tailwind CSS**: v4.1.14 - Framework de utilidades CSS
- **@tailwindcss/vite**: v4.1.14 - Plugin de Vite para Tailwind

### Desarrollo
- **TypeScript**: v5.9.3 - Tipado estático para JavaScript
- **Vite**: Bundler y servidor de desarrollo (incluido con Astro)
- **Node.js**: v18+ - Runtime de JavaScript

### Testing y Calidad
- **Vitest**: v3.1.4 - Framework de testing
- **@testing-library/react**: v16.3.0 - Testing utilities para React
- **@solidjs/testing-library**: v0.8.10 - Testing utilities para Solid.js
- **jsdom**: v27.0.0 - Implementación DOM para testing

### Despliegue y Hosting
- **Netlify**: Plataforma de hosting con soporte SSR
- **@astrojs/netlify**: v6.5.11 - Adaptador oficial para Netlify

### Herramientas Adicionales
- **SweetAlert2**: v11.26.2 - Alertas y modales elegantes
- **Yarn**: Gestor de paquetes

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto en una terminal:

### Comandos de Desarrollo

| Comando            | Acción                                                      |
| :----------------- | :---------------------------------------------------------- |
| `yarn install`     | Instala las dependencias del proyecto                       |
| `yarn dev`         | Inicia el servidor de desarrollo en `localhost:4321`        |
| `yarn start`       | Alias para `yarn dev`                                       |
| `yarn check`       | Ejecuta el chequeo de tipos de Astro y TypeScript           |

### Comandos de Build y Despliegue

| Comando            | Acción                                                      |
| :----------------- | :---------------------------------------------------------- |
| `yarn build`       | Construye el proyecto para producción en `./dist/`          |
| `yarn preview`     | Previsualiza la build localmente antes de desplegar         |

### Comandos de Testing

| Comando            | Acción                                                      |
| :----------------- | :---------------------------------------------------------- |
| `yarn test`        | Ejecuta las pruebas en modo watch                          |
| `yarn test run`    | Ejecuta las pruebas una sola vez                           |
| `yarn coverage`    | Genera el reporte de cobertura de pruebas                   |

### Comandos Utilitarios

| Comando            | Acción                                                      |
| :----------------- | :---------------------------------------------------------- |
| `yarn astro`       | Ejecuta comandos CLI de Astro                               |
| `yarn astro add`   | Añade integraciones de Astro                                |
| `yarn astro info`  | Muestra información del sistema y dependencias              |

## 🔐 Autenticación y Roles

El proyecto cuenta con un sistema de middleware de autenticación con los siguientes roles:

- **Super Admin**: Acceso completo a todas las rutas
- **Profesor**: Acceso a rutas privadas y de gestión
- **Usuario**: Acceso limitado

Las rutas están protegidas mediante cookies de sesión (`user` y `token`).

## 🧪 Testing

El proyecto utiliza Vitest para las pruebas unitarias con las siguientes configuraciones:

- **Entorno**: Node.js
- **Cobertura**: Provider V8 con reportes en texto y HTML
- **Archivos**: `tests/**/*.test.{ts,tsx,astro}`

Para ejecutar las pruebas:
```sh
yarn test
```

Para ver la cobertura:
```sh
yarn coverage
```

## 🌐 Despliegue

El proyecto está configurado para desplegarse en Netlify con salida en modo servidor (SSR).

## 🆘 Solución de Problemas

### Errores con dependencias

Si encuentras errores relacionados con dependencias, conflictos de versiones, o el proyecto no inicia correctamente:

#### Opción 1: Limpieza completa (Recomendado)

```sh
# En Windows (PowerShell/CMD)
Remove-Item -Recurse -Force node_modules, yarn.lock
yarn install

# En Linux/macOS
rm -rf node_modules yarn.lock
yarn install
```

#### Opción 2: Limpieza con caché

```sh
# Limpiar caché de Yarn
yarn cache clean

# Eliminar archivos y reinstalar
Remove-Item -Recurse -Force node_modules, yarn.lock  # Windows
rm -rf node_modules yarn.lock                        # Linux/macOS

# Reinstalar dependencias
yarn install
```

#### Opción 3: Verificación completa

```sh
# Verificar integridad de dependencias
yarn install --check-files

# Si hay problemas, forzar reinstalación
yarn install --force
```

### Errores de Node.js y versiones

#### Error: "node: command not found"
```sh
# Verificar que Node.js esté instalado
node --version

# Si no está instalado, descargar desde: https://nodejs.org/
```

#### Error: Versión de Node.js incompatible
```sh
# Este proyecto requiere Node.js 18+
# Actualiza Node.js o usa un gestor de versiones como nvm:

# Para Windows (usando nvm-windows)
nvm install 18
nvm use 18

# Para Linux/macOS (usando nvm)
nvm install 18
nvm use 18
```

### Errores de desarrollo

#### Puerto 4321 ocupado
```sh
# Cambiar puerto temporalmente
yarn dev --port 3000

# O encontrar qué proceso usa el puerto 4321
# Windows
netstat -ano | findstr :4321

# Linux/macOS
lsof -i :4321
```

#### Error de tipos TypeScript
```sh
# Verificar errores de tipado
yarn check

# Regenerar tipos de Astro
yarn astro sync
```

#### Error en build de producción
```sh
# Verificar build paso a paso
yarn check          # Verificar tipos
yarn test run       # Ejecutar pruebas
yarn build          # Construir proyecto
```

### Errores de testing

#### Vitest no ejecuta pruebas
```sh
# Verificar configuración de Vitest
yarn test --run

# Ejecutar pruebas en modo debug
yarn test --reporter=verbose
```

### Problemas de memoria

#### "JavaScript heap out of memory"
```sh
# Aumentar límite de memoria de Node.js
# En package.json, modificar scripts:
"dev": "node --max-old-space-size=4096 ./node_modules/.bin/astro dev"

# O ejecutar directamente:
node --max-old-space-size=4096 ./node_modules/.bin/astro dev
```

### Problemas específicos del proyecto

- **Middleware de autenticación**: Verifica que las cookies `user` y `token` estén configuradas
- **Variables de entorno**: Asegúrate de que `AUTH_URL` y otras variables necesarias estén definidas
- **Permisos de archivos**: En sistemas Unix, verifica permisos con `chmod +x node_modules/.bin/*`

### Obtener ayuda adicional

Si los problemas persisten:

1. **Información del sistema**:
   ```sh
   yarn astro info
   node --version
   yarn --version
   ```

2. **Logs detallados**:
   ```sh
   yarn dev --verbose
   ```

3. **Verificar integridad**:
   ```sh
   yarn check --verbose
   ```

## 📚 Recursos

- [Documentación de Astro](https://docs.astro.build)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Solid.js](https://www.solidjs.com/docs/latest)
- [Documentación de Vitest](https://vitest.dev/)

---

**Nota**: Este proyecto requiere Node.js 18+ y Yarn para funcionar correctamente.