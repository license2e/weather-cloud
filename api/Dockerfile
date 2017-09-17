FROM python:3.6.2-slim
MAINTAINER license2e

# Build and runtime deps
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    libpq-dev \
    libpython-dev \
    nginx \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# setup all the configfiles
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY nginx-app.conf /etc/nginx/sites-available/default
COPY supervisor-app.conf /etc/supervisor/conf.d/

# Environment config
ENV PYTHONUNBUFFERED 1
ENV DEBUG_MODE False

EXPOSE 80 80

# App setup
WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt
ADD . /app

CMD ["supervisord", "-n"]
