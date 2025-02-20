# Usa una versión de Node
FROM node:21-alpine3.18

# Crea un directorio de trabajo
WORKDIR /app

# Habilita pnpm a través de corepack
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

# Crea un usuario 'nodejs' (UID 1001) para no correr como root
RUN addgroup -g 1001 -S nodejs && adduser -S -u 1001 nodejs

# Copiamos primero los archivos de dependencias (para aprovechar la cache)
COPY package*.json ./
# Si usas pnpm-lock.yaml, también:
# COPY pnpm-lock.yaml ./

# Instalar dependencias (devDependencies incluidas, si las tuvieras)
RUN apk add --no-cache --virtual .gyp python3 make g++ \
    && apk add --no-cache git \
    && pnpm install \
    && apk del .gyp

# Copiamos el resto del código a /app
COPY . .

# Otorgar permisos de escritura al usuario nodejs sobre /app
RUN chown -R nodejs:nodejs /app

# Usar el usuario no-root
USER nodejs

# Exponer el puerto (Render inyectará la variable $PORT)
ARG PORT=3000
ENV PORT=$PORT
EXPOSE $PORT

# Inicio de la aplicación
CMD ["npm", "start"]
