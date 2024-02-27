## Using node image
FROM node:lts-alpine as prod-runner

## Set WORKDIR
WORKDIR /usr/app

## Copy all contents to WORKDIR
COPY . .

## Perform npm cache clean
RUN npm cache clean -force

## Update npm to latest
RUN npm i -g npm@latest

## Install all dependencies
RUN npm i

## Build project
RUN npm run build

# Start bot
CMD [ "npm", "run", "start:dev" ]