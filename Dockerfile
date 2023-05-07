FROM node:14-alpine

# Script arguments with default values
ARG NODE_ENV="production"

# Add arguments above to docker environment
ENV NODE_ENV=$NODE_ENV

# install curl for healthchecks
RUN apk --no-cache add curl

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm --production=false install
COPY . .
RUN npm run build
CMD ["npm", "start"]
