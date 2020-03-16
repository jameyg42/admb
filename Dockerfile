FROM node:alpine as SETUP

WORKDIR /app
RUN apk --no-cache add git
RUN npm config set strict-ssl false; npm install express cors git+https://jgraham@devtools.metlife.com/bitbucket/scm/~jgraham/appd-services-js.git

FROM node:alpine
COPY --from=SETUP /app/ ./
WORKDIR /app
CMD ["node", "src/server.js"]

ADD src/*.js src/
ADD ./dist ./dist

