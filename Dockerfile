FROM node:14
MAINTAINER LeeSeungHui <hithere1012@naver.com>
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3333
CMD ["npm", "start"]

