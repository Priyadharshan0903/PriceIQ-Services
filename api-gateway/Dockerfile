FROM node:18-alpine

WORKDIR /app

# Copy shared module first
COPY shared /app/shared
WORKDIR /app/shared
RUN npm install && npm run build

# Copy gateway files
WORKDIR /app/gateway
COPY api-gateway/package*.json ./
RUN npm install

COPY api-gateway/ ./
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
