FROM node:20-alpine
WORKDIR /app
COPY hotel-service/package*.json ./
RUN npm install --production
COPY shared/ ./shared/
COPY hotel-service/ ./
EXPOSE 4003
CMD ["node", "src/server.js"]
