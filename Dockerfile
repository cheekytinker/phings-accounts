FROM node:wheezy

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
# Bundle app source
COPY . /usr/src/app

RUN npm install

EXPOSE 10011
CMD npm start