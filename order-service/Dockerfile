FROM node:18-alpine
WORKDIR /app
COPY shared /app/shared
WORKDIR /app/shared
RUN npm install && npm run build
WORKDIR /app/service
COPY order-service/package*.json ./
RUN npm install
COPY order-service/ ./
RUN npm run build
EXPOSE 3006
CMD ["npm", "start"]
