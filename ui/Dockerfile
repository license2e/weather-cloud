FROM nginx
MAINTAINER license2e

echo 'deb http://ftp.debian.org/debian jessie-backports main' | tee /etc/apt/sources.list.d/backports.list

RUN apt-get update
RUN apt-get install certbot -t jessie-backports

#RUN apt-get install -y \
#    git \
#    nginx \
#    && rm -rf /var/lib/apt/lists/*

# setup all the configfiles
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY nginx-app.conf /etc/nginx/conf.d/default.conf

RUN /etc/init.d/nginx restart

EXPOSE 80 80

# App setup
ADD ./dist /app
WORKDIR /app

#RUN certbot certonly -a webroot --webroot-path=/app -d weather.shindyapin.com -m ilya+weather@shindyapin.com

CMD nginx
