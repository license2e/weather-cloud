FROM node:8.5-slim
MAINTAINER license2e

RUN apt-get update && apt-get install -y \
    git \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# setup all the configfiles
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY nginx-app.conf /etc/nginx/sites-available/default

EXPOSE 80 80

# App setup
ADD ./dist /app
WORKDIR /app

CMD nginx
