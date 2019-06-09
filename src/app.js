const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./helpers');
const {
	crearCurso,
	actualizarEstadoCurso,
	crearAspirante,
	eliminarAspiranteCurso
} = require('./funciones');

const directorioPublico = path.join(__dirname, '../public');
const directorioPartials = path.join(__dirname, '../partials');
app.use(express.static(directorioPublico));
hbs.registerPartials(directorioPartials);
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
	res.render('index', {});
});

app.get('/cursos', (req, res) => {

	res.render('cursos', {
		rol: req.query.rol
	});
});

app.post('/eliminar', (req, res) => {

	let resultado = [];
	if (req.body.boton === 'eliminar') {
		resultado = eliminarAspiranteCurso(req.body.docAspirante, req.body.id_curso);
	}

	res.render('cursos', {
		rol: req.query.rol,
		resultado: resultado,
		formulario: req.body
	});
});

app.post('/actualizar', (req, res) => {
	let resultado = [];
	if (req.body.boton === 'actualizar') {
		resultado = actualizarEstadoCurso(req.body.id_curso, req.body.estado);
	}

	res.render('cursos', {
		rol: req.query.rol,
		resultado: resultado,
		formulario: req.body
	});
});

app.post('/cursos', (req, res) => {

	let resultado = [];
	if (req.body.boton === 'crear') {
		resultado = crearCurso(req.body);
	} else if (req.body.boton === 'inscribir') {
		resultado = crearAspirante(req.body, req.body.id_curso);
	} else if (req.body.boton === 'limpiarCursos') {
		req.body.nombre = '';
		req.body.id = '';
		req.body.descripcion = '';
		req.body.valor = '';
		req.body.modalidad = '';
		req.body.intensidad = '';
		req.body.estado = '';
	} else if (req.body.boton === 'limpiarAspirantes') {
		req.body.nombre = '';
		req.body.doc = '';
		req.body.telefono = '';
		req.body.correo = '';
	}

	res.render('cursos', {
		rol: req.query.rol,
		resultado: resultado,
		formulario: req.body
	});

});
app.listen(3000, () => 
	console.log('Servidor escuchando en el puerto 3000')
);

//app.use('/css', express.static(dirNode_modules) + '/bootstrap/css');
//app.use('/js', express.static(dirNode_modules) + '/jquery');
//app.use('/js', express.static(dirNode_modules) + '/popper.js');
//app.use('/js', express.static(dirNode_modules) + '/bootstrap/js');