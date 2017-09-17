FROM node:8.5-slim
MAINTAINER license2e

RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    nginx

# setup all the configfiles
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY nginx-app.conf /etc/nginx/sites-available/default

EXPOSE 80 80

# App setup
ADD . /app
WORKDIR /app
RUN npm install -g @angular/cli
RUN yarn install
RUN ng build --prod


CMD nginx
