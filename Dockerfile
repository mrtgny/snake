FROM nginx:alpine
RUN apk add --update nodejs npm
WORKDIR /app

COPY . .

RUN npm i -g yarn
RUN yarn
RUN npm run build

COPY ./templates/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]