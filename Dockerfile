FROM node:8.1.4

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
# Bundle app source
COPY ./build/src /usr/src/app

RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN $HOME/.yarn/bin/yarn install

# inof only, not actually exposing anything with this
EXPOSE 10010 4000
CMD [ "apt yarn", "dockerstart" ]