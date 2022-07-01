FROM node:10

WORKDIR /usr/src/app/mrtgny

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
