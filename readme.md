# Proyecto 2 Bases de datos
## Requisitos
  - PHP 7.0 o mayor
  - Composer
  - Laravel
  - BCMath PHP Extension
- Ctype PHP Extension
- Fileinfo PHP extension
- JSON PHP Extension
- Mbstring PHP Extension
- OpenSSL PHP Extension
- PDO PHP Extension
- Tokenizer PHP Extension
- XML PHP Extension


### Orden para compilar
***
  1.  Bajar el repositorio
  2.  Correr en la consola dentro del folder composer install
  3.  Copiar el archivo .env.example y renombrarlo a .env unicamente y setear el enviorment adecuado. Utilizar posgres. Ingresar las credenciales para el usuario la base de datos y el nombre de la base de datos
  4.  Correr el comando php artisan keys:generate
  5.  Correr el script en la base de datos para popularla.
  6.  Usuario admin default: admin@streaming.com - Contraseña: secret
  7.  Para mongo db usar Pycharm. Y setear en el script las credenciales tanto de mongo como de posgres
  8.  Al haber populado la base de datos correr el comando yarn en la terminal.
  9.  Siguiente comando a correr sera php artisan serve dicho comando nos velovera un link al cual podremos usar para ingresar a nuestro proyecto. Antes de ir al link.
  10.  En una nueva pestaña de la terminal correr yarn watch una vez termine de compilar ingresar al url de php artisan serve/