FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY . .
RUN yarn install

ENV PORT=5050

EXPOSE 5050

CMD ["yarn", "start"]
