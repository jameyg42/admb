FROM node:alpine as SETUP

# FIXME - we're currently forcing the 'ng build' to run locally because
# a) it takes a long time to download all the Angular deps and b) we would
# have already built the dist locally - so we're currently using the local
# dist vs. rebuilding it in the container.  But we still need to build the
# server bits in the container, somewhat hackishly here
WORKDIR /app
RUN apk --no-cache add git
ADD package-server.json ./package.json
RUN npm config set strict-ssl false; npm install

FROM node:alpine
COPY --from=SETUP /app/ ./
WORKDIR /app
CMD ["node", "src/server.js"]

ADD src/*.js src/
ADD ./dist ./dist

