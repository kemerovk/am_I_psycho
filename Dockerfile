# Используем официальный образ Node.js
FROM node:22

WORKDIR /front
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]