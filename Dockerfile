FROM node:alpine as SETUP

WORKDIR /app
RUN apk --no-cache add git
RUN npm install express cors git+https://jgraham@devtools.metlife.com/bitbucket/scm/~jgraham/appd-services-js.git

FROM node:alpine
COPY --from=SETUP /app/ ./
WORKDIR /app
CMD ["node", "src/server.js"]

ADD src/server.js src/
ADD ./dist ./dist

