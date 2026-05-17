FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV CRM_PORTAL_TS_DB_PATH=/app/runtime/crm-portal-ts.sqlite
ENV CRM_PORTAL_TS_UPLOAD_ROOT=/app/runtime/uploads
ENV CRM_PORTAL_TS_BACKUP_ROOT=/app/runtime/backups

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/runtime/uploads /app/runtime/backups

EXPOSE 8080

CMD ["node", "dist/main.js"]
