FROM node:14-alpine AS staging

# RUN mkdir -p /app && chown -R node:node /app
WORKDIR /staging

# RUN yarn global add tsc @vue/cli @vue/cli-service lerna

# USER node
# root
COPY package.json .
COPY yarn.lock .
COPY lerna.json .

# server
COPY packages/server/package.json ./packages/server/

# client
COPY packages/client/package.json ./packages/client/

RUN yarn install --frozen-lockfile
RUN npx lerna bootstrap

# build
COPY . .
RUN cd packages/server && npx tsc --build
RUN cd packages/client && yarn build
# RUN npx lerna run build

RUN rm -rf node_modules

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

RUN yarn install --force
# Has to be manually added for some reason
RUN yarn add -W uuid 
RUN npx lerna bootstrap
RUN apk update && apk add bash

COPY --from=staging /staging/dist/ /app/dist/


# COPY --from=staging /staging/dist .
EXPOSE 3000

CMD ["node", "/app/dist/index.js"]
