FROM nginx:alpine
RUN apk add --update nodejs npm
WORKDIR /app

COPY . .

RUN npm i -g yarn
RUN yarn install --frozen-lockfile --network-timeout 100000
RUN npm run export
COPY ./templates/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]