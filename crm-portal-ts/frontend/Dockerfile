FROM node:22-bookworm-slim AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json package-lock.json ./
RUN pnpm install

COPY app ./app
COPY nuxt.config.ts ./
RUN pnpm run build

FROM node:22-bookworm-slim AS runtime

RUN npm install -g pnpm

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
