# Dockerfile
FROM node:latest

ENV TZ=Australia/Sydney

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "./index.js"]