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
	eliminarAspiranteCurso,
	ingresar,
	crearAspiranteCurso,
	actualizarUsuario
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

app.post('/', (req, res) => {

	let resultado = ingresar(req.body);

	if (resultado.estado === 'ok') {
		res.render('cursos', {
			rol: resultado.rol,
			resultado: resultado,
			formulario: req.body
		});
	} else {
		res.render('index', {
			rol: resultado.rol,
			resultado: resultado,
			formulario: req.body
		});
	}
});

app.get('/cursos', (req, res) => {

	res.render('cursos', {
		rol: req.query.rol,
		formulario: req.query
	});
});

app.post('/cursos', (req, res) => {

	res.render('cursos', {
		rol: req.query.rol,
		formulario: req.body
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

app.post('/crear', (req, res) => {

	let resultado = [];
	if (req.body.boton === 'limpiarCursos') {
		req.body.nombre = '';
		req.body.id = '';
		req.body.descripcion = '';
		req.body.valor = '';
		req.body.modalidad = '';
		req.body.intensidad = '';
		req.body.estado = '';
	} else if (req.body.boton === 'crear') {
		resultado = crearCurso(req.body);
	}

	res.render('cursos', {
		rol: req.query.rol,
		resultado: resultado,
		formulario: req.body
	});
});

app.post('/registro', (req, res) => {

	let resultado = [];
	if (req.body.boton === 'inscribir') {
		resultado = crearAspirante(req.body);
	}
	let parametros = {
		rol: resultado.rol,
		resultado: resultado,
		formulario: req.body
	};

	res.render('formCrearUsuario', parametros);
});

app.get('/usuarios', (req, res) => {

	res.render('adminUsuarios', {
		rol: req.query.rol
	});
});

app.post('/usuarios', (req, res) => {

	let resultado = actualizarUsuario(req.body);

	res.render('adminUsuarios', {
		rol: req.query.rol,
		resultado: resultado,
		formulario: req.body
	});
});

app.post('/inscribirAspCurso', (req, res) => {

	let resultado = [];
	if (req.body.boton === 'inscribirAspCurso') {
		resultado = crearAspiranteCurso(req.body);
	} else if (req.body.boton === 'remover') {
		resultado = eliminarAspiranteCurso(req.body.doc_aspirante, req.body.id_curso);
	}

	if (req.query.action) {
		req.body.action = req.query.action;
	}
	if (resultado.doc_aspirante) {
		req.body.doc = resultado.doc_aspirante;
	}

	res.render('cursos', {
		rol: req.query.rol,
		resultado: resultado,
		formulario: req.body
	});
});

app.get('/registro', (req, res) => {
	res.render('formCrearUsuario', {
		rol: req.query.rol
	});
});

app.listen(3000, () => 
	console.log('Servidor escuchando en el puerto 3000')
);

//app.use('/css', express.static(dirNode_modules) + '/bootstrap/css');
//app.use('/js', express.static(dirNode_modules) + '/jquery');
//app.use('/js', express.static(dirNode_modules) + '/popper.js');
//app.use('/js', express.static(dirNode_modules) + '/bootstrap/js');