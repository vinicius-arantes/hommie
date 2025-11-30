# Usar a imagem oficial do PHP com Apache
FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y libpq-dev

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql

# Definir o diretório de trabalho
WORKDIR /var/www/html

# Copiar o código da aplicação para o container
COPY . /var/www/html

# Expor a porta 9000 (porta padrão do PHP-FPM)
EXPOSE 9000

# Comando padrão para iniciar o PHP-FPM
CMD ["php-fpm"]
