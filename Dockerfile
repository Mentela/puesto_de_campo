FROM node:21-alpine3.18

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

# Copia los archivos de dependencias
COPY package*.json ./
# O si usas pnpm-lock.yaml:
# COPY pnpm-lock.yaml ./

RUN apk add --no-cache --virtual .gyp python3 make g++ \
    && apk add --no-cache git \
    && pnpm install \
    && apk del .gyp

# Copiar el resto del código
COPY . .

# Configurar variables y exponer
ARG PORT
ENV PORT=$PORT
EXPOSE $PORT

# (Opcional) cambiar a usuario nodejs
RUN addgroup -g 1001 -S nodejs && adduser -S -u 1001 nodejs
USER nodejs

CMD ["npm", "start"]
