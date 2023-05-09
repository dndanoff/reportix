FROM node:18.16.0-alpine3.16 AS base

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ARG WEB_HTTP_PORT
ENV WEB_HTTP_PORT ${WEB_HTTP_PORT}
ENV NODE_ENV prod

EXPOSE ${WEB_HTTP_PORT}

CMD [ "node", "-r", "source-map-support/register", "index.js" ]