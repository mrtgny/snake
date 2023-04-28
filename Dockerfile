FROM alpine as base
RUN apk add --update nodejs npm
WORKDIR /usr/src/app

RUN npm i -g yarn

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 100000
COPY . .

RUN npm run export

FROM nginx:alpine
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/out/ ./out

EXPOSE 80

COPY ./templates/nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]
