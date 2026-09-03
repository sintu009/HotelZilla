FROM node:20-alpine
WORKDIR /app
COPY admin-service/package*.json ./
RUN npm install --production
COPY shared/ ./shared/
COPY admin-service/ ./
EXPOSE 4001
CMD ["node", "src/server.js"]
