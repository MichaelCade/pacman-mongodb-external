FROM node:current-alpine

LABEL org.opencontainers.image.authors="sylvain@huguet.me"

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Install app dependencies
# Use environment variable to switch between development and production
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm ci --only=production; \
    fi

# Bundle app source
# Refer to .dockerignore to exclude content as needed
COPY . .

# Expose port 8080
EXPOSE 8080

# Run container
CMD [ "npm", "start" ]