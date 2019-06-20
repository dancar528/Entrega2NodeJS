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

var resultado=null;
var formulario=null;

const directorioPublico = path.join(__dirname, '../public');
const directorioPartials = path.join(__dirname, '../partials');
app.use(express.static(directorioPublico));
hbs.registerPartials(directorioPartials);
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
	if (resultado!=null && resultado.estado === 'ok') {
		res.render('cursos', {
			rol: resultado.rol,
			resultado: resultado,
			formulario: formulario,
			action:'cursos_disponibles',
			loggeado: (resultado!=null && resultado.estado === 'ok')
		});
	}else{
		res.render('index', {
			rol: '',
			loggeado: (resultado!=null && resultado.estado === 'ok')
		});
	}
	
});

app.post('/', (req, res) => {

	resultado = ingresar(req.body);
	formulario = req.body;

	if (resultado.estado === 'ok') {
		res.render('cursos', {
			rol: resultado.rol,
			resultado: resultado,
			formulario: req.body,
			action:'cursosinscritos',
			loggeado: (resultado!=null && resultado.estado === 'ok')
		});
	} else {
		res.render('index', {
			rol: resultado.rol,
			resultado: resultado,
			formulario: req.body,
			loggeado: (resultado!=null && resultado.estado === 'ok')
		});
	}
});

app.get('/cursos', (req, res) => {

	if (resultado!=null && resultado.rol=='coordinador') {
		res.render('cursos', {
			rol: resultado==null ? '' : resultado.rol,
			resultado: resultado,
			formulario: req.query,
			cursosInscritos: req.query.action,
			action:req.query.action,
			loggeado: (resultado!=null && resultado.estado === 'ok')
		});
	}

	if (req.query.action=='cursos_disponibles') {
		res.render('cursos', {
			rol: resultado==null ? '' : resultado.rol,
			resultado: resultado,
			formulario: req.query,
			cursosInscritos: req.query.action,
			action:req.query.action,
			loggeado: (resultado!=null && resultado.estado === 'ok')
		});
	}else{
		if (req.query.action=='cursosinscritos'){
			if(resultado!=null && resultado.estado === 'ok'){
				res.render('cursos', {
					rol: resultado==null ? '' : resultado.rol,
					resultado: resultado,
					formulario: req.query,
					cursosInscritos: req.query.action,
					action:req.query.action,
					loggeado: (resultado!=null && resultado.estado === 'ok')
				});
			}else{
				res.render('index', {
					rol: '',
					loggeado: (resultado!=null && resultado.estado === 'ok')
				});
			}
		}
		
	}
	
});

app.post('/cursos', (req, res) => {

	res.render('cursos', {
		rol: req.query.rol,
		formulario: req.body,
		action:req.query.action,
	});

});

//Eliminamos el alumno del curso
app.post('/eliminar', (req, res) => {

	let result = [];

	if (req.body.boton == 'remover' || req.body.boton == 'eliminar') {
		result = eliminarAspiranteCurso(req.body.doc_aspirante, req.body.id_curso);
	}

	if (req.query.action) {
		req.body.action = req.query.action;
	}
	if (result.doc_aspirante) {
		req.body.doc = result.doc_aspirante;
	}

	//console.log(result);

	res.render('cursos', {
		rol: resultado.rol,
		resultado: result,
		formulario: req.query,
		cursosInscritos: req.query.action,
		action:req.query.action,
		loggeado: (resultado!=null && resultado.estado === 'ok')
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
		formulario: req.body,
		action:req.query.action
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
	if (resultado!=null && resultado.estado === 'ok') {
		res.render('adminUsuarios', {
			rol: req.query.rol,
			loggeado: (resultado!=null && resultado.estado === 'ok')
		});
	}else{
		res.render('index', {
			rol: '',
			loggeado: (resultado!=null && resultado.estado === 'ok')
		});
	}
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
		formulario: req.body,
		action: 'cursos_disponibles',
		loggeado: (resultado!=null && resultado.estado === 'ok')
	});
});

app.get('/registro', (req, res) => {
	res.render('formCrearUsuario', {
		rol: req.query.rol,
		loggeado: (resultado!=null && resultado.estado === 'ok')
	});
});

app.get('/salir', (req, res) => {
	resultado = null;
	formulario=null;
	res.render('index', {
		rol: '',
		loggeado: (resultado!=null && resultado.estado === 'ok')
	});
	
});

app.listen(3000, () => 
	console.log('Servidor escuchando en el puerto 3000')
);

//app.use('/css', express.static(dirNode_modules) + '/bootstrap/css');
//app.use('/js', express.static(dirNode_modules) + '/jquery');
//app.use('/js', express.static(dirNode_modules) + '/popper.js');
//app.use('/js', express.static(dirNode_modules) + '/bootstrap/js');