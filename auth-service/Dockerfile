FROM node:18-alpine

WORKDIR /app

# Copy shared module first
COPY shared /app/shared
WORKDIR /app/shared
RUN npm install && npm run build

# Copy auth service files
WORKDIR /app/service
COPY auth-service/package*.json ./
RUN npm install

COPY auth-service/ ./
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
