FROM node:14-alpine AS prod

ENV NODE_ENV=production
ENV SERVER_PORT=3000

WORKDIR /app

# root
COPY package.json .
COPY yarn.lock .
COPY lerna.json .

# server
COPY packages/server/package.json ./packages/server/

# client
COPY packages/client/package.json ./packages/client/

RUN rm -rf node_modules

RUN yarn install --frozen-lockfile
# Has to be manually added for some reason
RUN yarn add -W uuid 
RUN npx lerna bootstrap
RUN apk update && apk add bash

COPY ./dist/ /app/dist/
EXPOSE 3000

CMD ["node", "/app/dist/index.js"]
