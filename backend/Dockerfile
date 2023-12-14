FROM node:21.1-alpine as build
WORKDIR /app
COPY . /app
COPY .dockerenv .env
RUN mkdir -p /app/public/files
RUN npm install
CMD ["node", "app.js"]