# Builds a Docker to deliver dist/
FROM nginx:latest
COPY dist/ /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY config/nginx/app.rest.studio.conf /etc/nginx/conf.d