# For the frontend Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package.json .
RUN npm install

# Copy the pre-built static assets into the container
COPY ./build ./build

EXPOSE 3000
CMD ["npm", "start"]
