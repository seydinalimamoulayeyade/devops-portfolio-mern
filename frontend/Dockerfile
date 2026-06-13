# frontend/Dockerfile

# ── Stage 1 : Build ──────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Stage 2 : Production ─────────────────────
FROM nginx:alpine AS production

# Copier les fichiers build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier le template nginx (avec variables)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Définir la valeur par défaut pour BACKEND_HOST (Docker Compose)
ENV BACKEND_HOST=backend

EXPOSE 80

# Le conteneur nginx:alpine supporte automatiquement /etc/nginx/templates/
# et fait le remplacement des variables avec envsubst au démarrage
CMD ["nginx", "-g", "daemon off;"]
