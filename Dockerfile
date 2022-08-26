FROM nginx:alpine
RUN apk add --update nodejs npm
WORKDIR /app
COPY . .
RUN yarn
RUN npm run build
COPY ./templates/nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]