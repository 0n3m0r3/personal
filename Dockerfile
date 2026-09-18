# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim@sha256:2fe369e969550cde8e867afc3fe370b260140cab4a23d467074295b42163d553 AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive
COPY . .
RUN yarn build && yarn tsc --noEmit && node --test tests/chat.test.mjs

FROM node:24-bookworm-slim@sha256:2fe369e969550cde8e867afc3fe370b260140cab4a23d467074295b42163d553 AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 PORTFOLIO_CHAT_MODE=off
LABEL org.opencontainers.image.source="https://github.com/0n3m0r3/personal"
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
