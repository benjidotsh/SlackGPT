# Build
FROM node:18 as build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

# Run
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/build/src .
EXPOSE $PORT
CMD [ "node", "main.js" ]