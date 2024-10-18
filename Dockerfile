FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Expose the port 5000
EXPOSE 5000

CMD ["node", "server.js"]
