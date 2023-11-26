FROM node:21.1-alpine as build
WORKDIR /app
COPY . /app
COPY .dockerenv .env
RUN npm install
CMD ["node", "index.js"]