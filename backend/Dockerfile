FROM node:18.16.0-alpine3.16 AS base

WORKDIR /usr/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE ${WEB_HTTP_PORT}

CMD npm run db:init; npm run start