## Descargar proyecto
  - Ir a https://github.com/dancar528/Entrega2NodeJS/releases/tag/1.0.4 y descargar en el formato deseado
  - Ó clonar el proyecto, ir a https://github.com/dancar528/Entrega2NodeJS
    - Clone or download, y copiar la url de git
    - Ir a la carpeta donde se desea descargar el proyecto en su computador, abrir la consola y digitar ```git clone <url copiada de git>```

## Instalar proyecto
Situarse en la carpeta del proyecto, abrir la consola y digitar el siguiente comando, (para instalar las dependencias):

```sh
npm install
```
## Ejecutar aplicación
Situarse en la carpeta del proyecto, abrir la consola y digitar el siguiente comando:
```sh
node src/app
```
ó
```sh
nodemon src/app -e js,hbs
```
#### Nota
Para probar en local, se debe tener instalado __mongodb__ y crear la base de datos __educacionContinua__ con dos colecciones (o tablas): _usuarios_ y _aspirantes_, con los siguientes campos:
  - __usuarios__: doc, password y rol, todos requeridos
  - __aspirantes__: doc, nombre, correo y telefono, todos requeridos

Insertar un registro en cada uno de estas colecciones (usuarios y aspirantes), lo importante es que el rol del usuario sea __coordinador__.

## Probar aplicación
Abrir un navegador y dirigirse a `localhost:3000`

### Funcionamiento básico de la aplicación.
#### Roles:
Al iniciar sesión, dependiendo del rol:
  - __Coordinador__: le aparecen 3 menus, en uno se listan todos los cursos en todos los estados, en el otro solo los cursos disponibles y en el tercer menu permite administrar los usuarios: listarlos y modificarlos
  - __aspirante__: le aparecen 2 menus, 1 de los cursos disponibles y otro donde muestra los cursos que tiene inscritos
  - __docente__: le aparece un menu de ver los cursos que tiene asignados, junto con los aspirantes inscritos
  - __interesado__: o usuario sin loguear, le aparece un menu de ver los cursos disponibles. Este rol no debe aparecer en la base de datos.
  
  ### Funcionamiento del chat.
 Como aspirante o docente entra por mis cursos o cursos asignados (en el caso del coordinador), se selecciona un curso, dar clic en más información y ahí debe aparecer un botón llamado entrar al curso. Existe un chat por cada curso creado, de manera que si un aspirante o docente tiene varios cursos inscritos o asignados, solo le aparecerá el contenido de cada curso en el chat seleccionado.
 
  
