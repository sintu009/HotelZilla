FROM node:20-alpine
WORKDIR /app
COPY user-service/package*.json ./
RUN npm install --production
COPY shared/ ./shared/
COPY user-service/ ./
EXPOSE 4002
CMD ["node", "src/server.js"]
