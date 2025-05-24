FROM nginx:alpine

# Удаляем дефолтную конфигурацию Nginx
RUN rm -rf /etc/nginx/conf.d/*

# Копируем нашу конфигурацию
COPY nginx.conf /etc/nginx/nginx.conf

# Копируем собранное приложение
COPY dist/ /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]

#docker run --rm -d -p 80:80 --name react-app task-front