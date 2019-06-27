const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');
require('./helpers');
const {
	crearCurso,
	actualizarEstadoCurso,
	crearAspirante,
	eliminarAspiranteCurso,
	ingresar,
	crearAspiranteCurso,
	actualizarUsuario,
	consultarAspirante
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
	if (req.session.nombre) {
		res.locals.sesion = true;
		res.locals.rol_sesion = req.session.rol;
		res.locals.nombre_usuario = req.session.nombre;
	} else {
		res.locals.sesion = false;
	    res.locals.rol_sesion = 'interesado';
	    res.locals.nombre_usuario = '';
	}
	// Almacenando la info del usuario como token, en vez de variable de sesion
	/*let token = localStorage.getItem('token');
	jwt.verify(token, 'tdea-virtual', (err, decoded) => {
		if (err) {
			console.log(err);
			return next();
		}
		console.log(decoded);
		res.locals.sesion = true;
		res.locals.rol_sesion = decoded.data;
		next();
	});	*/
	next();
});

app.get('/', (req, res) => {
	if (resultado!=null && resultado.estado === 'ok') {
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

	resultado = ingresar(req.body);
	formulario = req.body;
	if (resultado.estado === 'ok') {

		let usuario = consultarAspirante(req.body.doc);
		res.locals.sesion = true;
	    res.locals.rol_sesion = resultado.rol;
	    res.locals.nombre_usuario = usuario.nombre;
		req.session.rol = resultado.rol;
		req.session.nombre = usuario.nombre;
		/*let token = jwt.sign({
				data: resultado.rol,
			}, 'tdea-virtual', { expiresIn: '1h'});
		localStorage.setItem('token', token);*/
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
	if (resultado != null && res.locals.rol_sesion == 'coordinador') {
		res.render('cursos', {
			rol: resultado==null ? '' : res.locals.rol_sesion,
			resultado: resultado,
			formulario: req.query,
			cursosInscritos: req.query.action,
			action:req.query.action,
			loggeado: (resultado!=null && resultado.estado === 'ok')
		});
	}

	if (req.query.action=='cursos_disponibles') {
		res.render('cursos', {
			rol: resultado==null ? '' : res.locals.rol_sesion,
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
					rol: resultado==null ? '' : res.locals.rol_sesion,
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
		rol: res.locals.rol_sesion,
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

	res.render('cursos', {
		rol: res.locals.rol_sesion,
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
		resultado = actualizarEstadoCurso(req.body.id_curso, req.body.estado, req.body.docente);
	}

	res.render('cursos', {
		rol: res.locals.rol_sesion,
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
		rol: res.locals.rol_sesion,
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
		rol: res.locals.rol_sesion,
		resultado: resultado,
		formulario: req.body
	};
	res.render('formCrearUsuario', parametros);
});

app.get('/usuarios', (req, res) => {

	if (resultado!=null && resultado.estado === 'ok') {
		res.render('adminUsuarios', {
			rol: res.locals.rol_sesion,
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
		rol: res.locals.rol_sesion,
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
	req.session.rol = 'interesado';
	req.session.nombre = '';
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