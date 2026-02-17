FROM node:18-alpine

WORKDIR /app

# Copy shared module first
COPY shared /app/shared
WORKDIR /app/shared
RUN npm install && npm run build

# Copy product service files
WORKDIR /app/service
COPY product-service/package*.json ./
RUN npm install

COPY product-service/ ./
RUN npm run build

EXPOSE 3002

CMD ["npm", "start"]
