FROM node:18-alpine

WORKDIR /app

COPY shared /app/shared
WORKDIR /app/shared
RUN npm install && npm run build

WORKDIR /app/service
COPY comparison-service/package*.json ./
RUN npm install

COPY comparison-service/ ./
RUN npm run build

EXPOSE 3004

CMD ["npm", "start"]
