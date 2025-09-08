FROM node:22-bullseye-slim


WORKDIR /app

# Copy only files required to install
# dependencies (better layer caching)
COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]