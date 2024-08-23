# Using Lightweight docker image for node
FROM node:20-alpine AS base


# Setting Up Working Directory
WORKDIR /usr/src/backend-app


# Copying Package Files
COPY package*.json ./


# Installing Dependencies
RUN npm ci --only=production


# Copying Files
COPY . .


# Exposing Port
EXPOSE 8080

# Build Typescript project
RUN npm run dist

# Start Application
CMD ["npm", "start"]
