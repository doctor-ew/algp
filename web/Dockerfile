# /web/Dockerfile

# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml (or package-lock.json if you use it)
COPY package.json pnpm-lock.yaml* ./

# Install any needed packages
RUN pnpm install

# Bundle app source
COPY . .

# Build your app
RUN pnpm run build

# Your app runs on port 3000
EXPOSE 3000

# Define the command to run your app
CMD [ "pnpm", "start" ]
