FROM node

WORKDIR /usr/src/app/mrtgny

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
