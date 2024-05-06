FROM node:18-alpine

WORKDIR /client_delta_twin

COPY package*.json ./

RUN npm install

COPY . /client_delta_twin

RUN npm run build

CMD npm run start