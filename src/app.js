const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('./helpers');
const {
	crearCurso,
	actualizarEstadoCurso,
	crearAspirante,
	eliminarAspiranteCurso,
	ingresar,
	crearAspiranteCurso,
	actualizarUsuario,
	consultarAspirante,
	mostrarAspirantesXCurso,
	listarDocentes
} = require('./funciones');

var resultado=null;
var formulario=null;

/*if (typeof localStorage === 'undefined' || localStorage === null) {
	// si no existe un local storage, crea una carpeta llamada scratch
	// para almacenar la info
	var LocalStorage = require('node-localstorage').LocalStorage;
	localStorage = new LocalStorage('./scratch');
}*/

const directorioPublico = path.join(__dirname, '../public');
const directorioPartials = path.join(__dirname, '../partials');
app.use(express.static(directorioPublico));
hbs.registerPartials(directorioPartials);
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'hbs');

app.use(session({
	secret: ' ',
	resave: false,
	saveUninitialized: true
}));

app.use((req, res, next) => {

	if (req.session.rol) {
		res.locals.sesion = true;
		res.locals.rol_sesion = req.session.rol;
		res.locals.nombre_usuario = req.session.nombre;
		res.locals.doc_sesion = req.session.doc;
	}
	next();
});

mongoose.connect(
	'mongodb://localhost:27017/educacionContinua',
	{ useNewUrlParser: true},
	(err, resultado) => {
		if (err) {
			return console.log(err);
		}
		console.log('Conectado');
	}
);

app.get('/', (req, res) => {
	if (req.session.rol) {
		res.render('cursos', {
			rol: res.locals.rol_sesion,
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

	formulario = req.body;
	ingresar(req.body, async(resultado) => {
		let listacursoestudiante = [];
		let docentes = [];
		if(resultado.rol=='coordinador'){
			listacursoestudiante = await mostrarAspirantesXCurso();
			docentes = await listarDocentes();
		}
	    if (resultado.estado == 'ok') {
	    	req.session.rol = resultado.rol;
			res.locals.sesion = true;
	    	res.locals.rol_sesion = resultado.rol;
	    	consultarAspirante(req.body.doc, (usuario) => {
			    res.locals.nombre_usuario = usuario.nombre;
			    res.locals.doc_sesion = usuario.doc;
				req.session.nombre = usuario.nombre;
				req.session.doc = usuario.doc;
				/*let token = jwt.sign({
						data: resultado.rol,
					}, 'tdea-virtual', { expiresIn: '1h'});
				localStorage.setItem('token', token);*/
				res.render('cursos', {
					rol: resultado.rol,
					resultado: resultado,
					formulario: req.body,
					action: 'cursosinscritos',
					resultlist: listacursoestudiante,
					docentes: docentes,
				});
			});
	    } else {
	    	req.session.rol = 'interesado';
	    	res.locals.rol_sesion = 'interesado';

			res.render('index', {
				rol: resultado.rol,
				resultado: resultado,
				formulario: req.body
			});
		}
	});
});

app.get('/cursos', async (req, res) => {
	let listacursoestudiante = [];
	let docentes = [];
	if(req.session.rol=='coordinador'){
		listacursoestudiante = await mostrarAspirantesXCurso();
		docentes = await listarDocentes();
	}
	res.render('cursos', {
		rol: res.locals.sesion ? res.locals.rol_sesion : '',
		resultado: resultado,
		formulario: req.query,
		cursosInscritos: req.query.action,
		action:req.query.action,
		resultlist: listacursoestudiante,
		docentes: docentes
	});
});

app.post('/cursos', async (req, res) => {
	let listacursoestudiante = [];
	let docentes = [];
	if(req.session.rol=='coordinador'){
		listacursoestudiante = await mostrarAspirantesXCurso();
		docentes = await listarDocentes();
	}
	res.render('cursos', {
		rol: res.locals.rol_sesion,
		formulario: req.body,
		action:req.query.action,
		resultlist: listacursoestudiante,
		docentes: docentes
	});

});

//Eliminamos el alumno del curso
app.post('/eliminar', async(req, res) => {

	let result = [];

	let listacursoestudiante = [];
	let docentes = [];

	if (req.body.boton == 'remover' || req.body.boton == 'eliminar') {
		result = await eliminarAspiranteCurso(req.body.doc_aspirante, req.body.id_curso);
	}

	if(req.session.rol=='coordinador'){
		listacursoestudiante = await mostrarAspirantesXCurso();
		docentes = await listarDocentes();
	}

	if (req.query.action) {
		req.body.action = req.query.action;
	}
	if (result.doc_aspirante) {
		req.body.doc = result.doc_aspirante;
	}

	res.render('cursos', {
		rol: res.locals.rol_sesion,
		resultado: result,
		formulario: req.query,
		cursosInscritos: req.query.action,
		action:req.query.action,
		loggeado: (resultado!=null && resultado.estado === 'ok'),
		resultlist: listacursoestudiante,
		docentes: docentes
	});
});

app.post('/actualizar', async(req, res) => {

	let resultado = [];
	let listacursoestudiante = [];
	let docentes = [];
	
	if (req.body.boton == 'actualizar') {
		resultado = await actualizarEstadoCurso(req.body.id_curso, req.body.estado, req.body.docente);
	}

	if(req.session.rol=='coordinador'){
		listacursoestudiante = await mostrarAspirantesXCurso();
		docentes = await listarDocentes();
	}
	res.render('cursos', {
		rol: res.locals.rol_sesion,
		resultado: resultado,
		formulario: req.body,
		action:req.query.action,
		resultlist: listacursoestudiante,
		docentes: docentes
	});
});

app.post('/crear', async(req, res) => {

	let resultado = [];
	if (req.body.boton == 'limpiarCursos') {
		req.body.nombre = '';
		req.body.id = '';
		req.body.descripcion = '';
		req.body.valor = '';
		req.body.modalidad = '';
		req.body.intensidad = '';
		req.body.estado = '';
	} else if (req.body.boton == 'crear') {
		resultado = await crearCurso(req.body);
	}

	let listacursoestudiante = [];
	let docentes = [];
	if(req.session.rol=='coordinador'){
		listacursoestudiante = await mostrarAspirantesXCurso();
		docentes = await listarDocentes();
	}

	res.render('cursos', {
		rol: res.locals.rol_sesion,
		resultado: resultado,
		formulario: req.body,
		action:req.query.action,
		resultlist: listacursoestudiante,
		docentes: docentes
	});
});

app.post('/registro', async (req, res) => {

	let resultado = [];
	if (req.body.boton == 'inscribir') {
		resultado = await crearAspirante(req.body);
	}

	let parametros = {
		//rol: res.locals.rol_sesion,
		resultado: resultado,
		formulario: req.body
	};
	res.render('formCrearUsuario', parametros);
});

app.get('/usuarios', (req, res) => {

	res.render('adminUsuarios', {
		rol: res.locals.rol_sesion
	});
});

app.post('/usuarios', async (req, res) => {

	let resultado = await actualizarUsuario(req.body);

	res.render('adminUsuarios', {
		rol: res.locals.rol_sesion,
		resultado: resultado,
		formulario: req.body
	});
});

app.post('/inscribirAspCurso', async(req, res) => {

	let resultado = [];
	if (req.body.boton == 'inscribirAspCurso') {
		resultado = await crearAspiranteCurso(req.body);
	} else if (req.body.boton == 'remover') {
		resultado = await eliminarAspiranteCurso(req.body.doc_aspirante, req.body.id_curso);
	}

	if (req.query.action) {
		req.body.action = req.query.action;
	}
	if (resultado.doc_aspirante) {
		req.body.doc = resultado.doc_aspirante;
	}

	res.render('cursos', {
		rol: res.locals.rol_sesion,
		resultado: resultado,
		formulario: req.body,
		action: 'cursos_disponibles',
		loggeado: (resultado!=null && resultado.estado === 'ok')
	});
});

app.get('/registro', (req, res) => {
	res.render('formCrearUsuario', {
		rol: res.locals.rol_sesion,
		loggeado: (resultado!=null && resultado.estado === 'ok')
	});
});

app.get('/salir', (req, res) => {
	// Al salir, eliminamos variables de sesion
	//localStorage.setItem('token', '');
	resultado = null;
	formulario=null;
	res.locals.sesion = false;
	res.locals.rol_sesion = 'interesado';
	res.locals.nombre_usuario = '';
	res.locals.doc_sesion = '';
	req.session.rol = 'interesado';
	req.session.nombre = '';
	req.session.doc = '';

	res.render('index', {
		rol: res.locals.rol_sesion,
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