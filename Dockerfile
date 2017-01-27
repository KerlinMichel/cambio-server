FROM node:4-onbuild
RUN mkdir -p /usr/src/server
WORKDIR /usr/src/server
COPY . /usr/src/server
RUN npm install
