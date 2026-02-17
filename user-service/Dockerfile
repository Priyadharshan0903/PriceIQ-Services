FROM node:18-alpine
WORKDIR /app
COPY shared /app/shared
WORKDIR /app/shared
RUN npm install && npm run build
WORKDIR /app/service
COPY user-service/package*.json ./
RUN npm install
COPY user-service/ ./
RUN npm run build
EXPOSE 3007
CMD ["npm", "start"]
