# Use an official Node runtime as the base image, change from 18.18.0 to LTS
FROM node:18.20.4

# Set the working directory in the container
WORKDIR /usr/src/app

RUN npm install -g @angular/cli

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Angular application
RUN npm run build

# Expose the default web application port
EXPOSE 80

# Start the Node.js application
CMD [ "npm", "start", "--", "--host", "0.0.0.0" ]
#"--port", "80" ,