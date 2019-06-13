Para ejecutar el proyecto:

Situarse en la carpeta del proyecto, abrir la consola y digitar el siguiente comando:

npm install

Y luego

node src/app

Dirigirse al navegador a:

localhost:3000

En el archivo usuarios.json estan los usuarios del sistema con su rol, documento y contraseña de acceso.

Al iniciar sesión, dependiendo del rol:
	- Coordinador: le aparecen 3 menus, en uno se listan todos los cursos en todos los estados, en el otro solo los cursos disponibles y en el tercer menu permite administrar los usuarios: listarlos y modificarlos
	- aspirante: le aparecen 2 menus, 1 de los cursos disponibles y otro donde muestra los cursos que tiene inscritos
	- interesado: o usuario sin loguear, le aparece un menu de ver los cursos disponibles

Para cerrar sesion basta con ir a localhost:3000