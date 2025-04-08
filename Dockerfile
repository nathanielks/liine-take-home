FROM node:22-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Add Tini to ensure process signal forwarding works
RUN apt-get update -y && apt-get install tini

COPY src/ ./src/
COPY package*.json .
COPY tsconfig.json .

RUN npm ci
RUN npm run build:ts

# Run as the node user (UID 1000)
EXPOSE 3000
USER 1000
ENV NODE_ENV=production
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["npm", "start"]
