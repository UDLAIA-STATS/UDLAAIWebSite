# Imagen base de Node.js LTS con Alpine para menor tamaño
FROM node:22-alpine AS base

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package.json yarn.lock* ./

# Etapa de dependencias
FROM base AS deps

# Instalar dependencias de producción y desarrollo
RUN yarn install --frozen-lockfile

# Etapa de construcción
FROM base AS builder

# Copiar node_modules de la etapa anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar el código fuente
COPY . .

# Copiar archivos de variables de entorno
COPY .env.production .env.production
COPY .env.development .env.development

# Argumento para determinar el entorno de build
ARG BUILD_ENV=production

# Variables de entorno para build
ENV NODE_ENV=${BUILD_ENV}

# Crear enlace simbólico al archivo de entorno correcto
RUN if [ "$BUILD_ENV" = "development" ]; then \
        ln -sf .env.development .env; \
    else \
        ln -sf .env.production .env; \
    fi

# Ejecutar type checking y build
RUN yarn check && yarn build

# Etapa final - imagen de producción
FROM node:22-alpine AS runner

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 astrojs
RUN adduser --system --uid 1001 astro

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios para producción
COPY --from=builder --chown=astro:astrojs /app/dist ./dist
COPY --from=builder --chown=astro:astrojs /app/package.json ./package.json
COPY --from=builder --chown=astro:astrojs /app/.env* ./

# Argumento para determinar el entorno de ejecución
ARG RUN_ENV=production

# Crear enlace simbólico al archivo de entorno correcto en runtime
RUN if [ "$RUN_ENV" = "development" ]; then \
        ln -sf .env.development .env; \
    else \
        ln -sf .env.production .env; \
    fi

# Instalar solo dependencias de producción necesarias para preview
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Cambiar al usuario no-root
USER astro

# Exponer puerto
EXPOSE 4321

# Variables de entorno
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Comando para iniciar la aplicación
CMD ["yarn", "preview"]