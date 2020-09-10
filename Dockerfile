FROM node:14-alpine

WORKDIR /srv

COPY package.json \
     package-lock.json \
     dist/ \
     ./

RUN npm install

CMD node --enable-source-maps ./bot.js