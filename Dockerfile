FROM node:20.11.1-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm install -g @nestjs/cli

RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
