# Pin specific version for stability
# Use slim for reduced image size
FROM node:22-bullseye-slim

# Specify working directory other than /
WORKDIR /app

COPY package*.json ./


RUN npm install


USER node

COPY . .

CMD [ "npm", "run", "dev:jaeger" ]