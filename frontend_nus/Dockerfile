# Use an official Node runtime as the base image
#FROM node:20.18.0
FROM node:20.18-slim as base
ENV NODE_ENV=20.18.0

# Set the working directory in the container
WORKDIR /usr/src/app

RUN npm install -g @angular/cli

#Ensure that both node_modules and package-lock.json are removed.
COPY package*.json ./
RUN rm -rf node_modules package-lock.json


# Install application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Angular application
RUN npm run build

# Expose the default web application port
EXPOSE 80

# Start the Node.js application
CMD [ "npm", "start", "--", "--port", "80" , "--host", "0.0.0.0" ]

