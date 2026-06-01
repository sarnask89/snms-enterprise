FROM node:22-bookworm-slim AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json package-lock.json ./
RUN pnpm install

COPY tsconfig.json ./
COPY src ./src
RUN pnpm run build

FROM node:22-bookworm-slim AS runtime

RUN npm install -g pnpm

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV CRM_PORTAL_TS_DB_PATH=/app/runtime/crm-portal-ts.sqlite
ENV CRM_PORTAL_TS_UPLOAD_ROOT=/app/runtime/uploads
ENV CRM_PORTAL_TS_BACKUP_ROOT=/app/runtime/backups

COPY package.json package-lock.json ./
RUN pnpm install --prod

COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/runtime/uploads /app/runtime/backups

EXPOSE 8080

CMD ["node", "dist/main.js"]
