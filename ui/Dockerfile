FROM node:7.4
MAINTAINER license2e

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# Build and runtime deps
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    nginx \
    yarn

# setup all the configfiles
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY nginx-app.conf /etc/nginx/sites-available/default

EXPOSE 80 80

# App setup
ADD . /app
WORKDIR /app
RUN yarn install
RUN ng build --prod


CMD nginx
