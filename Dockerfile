FROM nginx
COPY data/www /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf