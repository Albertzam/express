FROM node:16-alpine

COPY ./package.json package.json
COPY ./dist dist
RUN yarn install --production

CMD node dist/index.js