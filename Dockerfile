FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/frontend/package.json apps/frontend/
COPY apps/backend-nest/package.json apps/backend-nest/
RUN npm install
COPY apps/frontend apps/frontend
COPY apps/backend-nest apps/backend-nest
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/apps/backend-nest/dist ./dist
COPY --from=builder /app/apps/backend-nest/package.json ./
RUN npm install --omit=dev
COPY --from=builder /app/apps/frontend/dist ./public
EXPOSE 3100
CMD ["node", "dist/main.js"]
