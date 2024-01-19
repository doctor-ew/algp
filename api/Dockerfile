#/api/Dockerfile

# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/api

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml (or package-lock.json if you use it)
COPY package.json pnpm-lock.yaml* ./

# Install any needed packages
RUN pnpm install

# Bundle app source
COPY . .
COPY X509-cert-5359790680517600107.pem ./
# Build your app
RUN pnpm run build

# Your app runs on port 4000
EXPOSE 4000

# Define the command to run your app
CMD [ "pnpm", "start" ]
