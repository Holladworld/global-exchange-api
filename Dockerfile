FROM node:18

# Install dependencies for node-canvas
RUN apt-get update && apt-get install -y \
  libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]
