FROM node:21 AS nest-dependencys

WORKDIR /usr/src/app

RUN apt-get update && apt-get upgrade -y

RUN yarn config set strict-ssl false && yarn global add @nestjs/cli

COPY . .

RUN chmod -R 777 .

RUN yarn install
 
# CMD [ "yarn", "start:dev" ]

# Mantener el contenedor en ejecución
# CMD ["tail", "-f", "/dev/null"]