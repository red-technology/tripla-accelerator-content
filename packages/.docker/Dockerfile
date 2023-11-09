FROM node:18.18-bullseye-slim

#Install dumb-init
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

# Ensure production environment
ENV NODE_ENV production

#Get Curl
RUN apt-get update && apt-get install -y curl

#Create a directory for hosting the app
WORKDIR /app

RUN install -d -m 0777 /certs
RUN chown node:node /certs

WORKDIR /app/certs

RUN apt-get update && apt-get install -y openssl && openssl genrsa -des3 -passout pass:x -out server.pass.key 2048 && openssl rsa -passin pass:x -in server.pass.key -out server.key && rm server.pass.key && openssl req -new -key server.key -out server.csr \
  -subj "/C=UK/ST=Oxfordshire/L=Oxford/O=RedTechnology/OU=Development/CN=localhost" && openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

WORKDIR /app

#Create a storage volume for logs, assets, certificates
RUN install -d -m 0777 /storage
RUN install -d -m 0777 /logs
RUN chown node:node /storage
RUN chown node:node /logs

COPY --chown=node:node package.json .

COPY --chown=node:node yarn.lock .

COPY --chown=node:node .yarnrc.yml .

COPY --chown=node:node .yarn/ .yarn/

COPY --chown=node:node ./packages/ packages/

# I feel like this should be yarn and be immutable to prevent upgrading of dependencies but that is raising an error
# RUN yarn --immutable
RUN yarn install

RUN yarn build

# USER node

VOLUME ["/app/storage", "/app/logs", "/app/certs"]
