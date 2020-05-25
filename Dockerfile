FROM node:13.8

WORKDIR /srv

COPY package.json \
     package-lock.json \
     dist/ \
     ./

RUN npm install

CMD node ./bot.js