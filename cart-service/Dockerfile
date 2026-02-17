FROM node:18-alpine
WORKDIR /app
COPY shared /app/shared
WORKDIR /app/shared
RUN npm install && npm run build
WORKDIR /app/service
COPY cart-service/package*.json ./
RUN npm install
COPY cart-service/ ./
RUN npm run build
EXPOSE 3005
CMD ["npm", "start"]
