FROM node:18-alpine

WORKDIR /app

# Copy shared module first
COPY shared /app/shared
WORKDIR /app/shared
RUN npm install && npm run build

# Copy review service files
WORKDIR /app/service
COPY review-service/package*.json ./
RUN npm install

COPY review-service/ ./
RUN npm run build

EXPOSE 3003

CMD ["npm", "start"]
