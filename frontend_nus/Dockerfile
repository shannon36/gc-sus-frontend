# Use an official Node runtime as the base image
FROM node:22.8.0-alphine

#Ensure that both node_modules and package-lock.json are removed.
COPY package.json .
RUN rm -rf node_modules package-lock.json

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
CMD [ "npm", "start", "--", "--port", "80" , "--host", "0.0.0.0" ]
