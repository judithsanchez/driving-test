FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g json-server

COPY db.json /app/db.json
COPY . .

EXPOSE 3000

RUN chown -R node:node /app
USER node

CMD ["npm", "run", "json-server", "--", "--host", "0.0.0.0"]
