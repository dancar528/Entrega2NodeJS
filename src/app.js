const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('./helpers');
require('./config/config');
//require('./chat/app');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const sockets = io.listen(server);
const { Usuario } = require('./chat/Usuario');
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
	process.env.URLDB,
	{ useNewUrlParser: true},
	(err, resultado) => {
		if (err) {
			return console.log(err);
		}
		console.log('Conectado');
	}
);

app.get('/', async(req, res) => {
	if (req.session.rol) {
		let listacursoestudiante = [];
		let docentes = [];
		if(res.locals.rol_sesion=='coordinador' || res.locals.rol_sesion=='docente'){
			listacursoestudiante = await mostrarAspirantesXCurso();
			docentes = await listarDocentes();
		}
		res.render('cursos', {
			rol: res.locals.rol_sesion,
			resultado: resultado,
			formulario: formulario,
			action:'cursos_disponibles',
			loggeado: (resultado!=null && resultado.estado === 'ok'),
			resultlist: listacursoestudiante,
			docentes: docentes
		});
	}else{
		res.render('index', {
			rol: '',
			loggeado: (resultado!=null && resultado.estado === 'ok')
		});
	}
});

app.post('/entrarCurso', (req, res) => {
	res.render('curso', {
		id_curso: req.body.id_curso,
		nombre_usuario: req.body.nombre_usuario,
		nombre_curso: req.body.nombre_curso
	});
});

app.post('/', (req, res) => {

	formulario = req.body;
	ingresar(req.body, async(resultado) => {
		let listacursoestudiante = [];
		let docentes = [];
		
	    if (resultado.estado == 'ok') {
	    	req.session.rol = resultado.rol;
			res.locals.sesion = true;
			res.locals.rol_sesion = resultado.rol;
			if(res.locals.rol_sesion=='coordinador' || res.locals.rol_sesion=='docente'){
				listacursoestudiante = await mostrarAspirantesXCurso();
				docentes = await listarDocentes();
			}
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
					docentes: docentes
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
	if(res.locals.rol_sesion=='coordinador' || res.locals.rol_sesion=='docente'){
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
	if(res.locals.rol_sesion=='coordinador' || res.locals.rol_sesion=='docente'){
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

	if(res.locals.rol_sesion=='coordinador' || res.locals.rol_sesion=='docente'){
		listacursoestudiante = await mostrarAspirantesXCurso();
		docentes = await listarDocentes();
	}

	if (req.query.action) {
		req.body.action = req.query.action;
	}
	
	req.body.doc = res.locals.doc_sesion;
	
	res.render('cursos', {
		rol: res.locals.rol_sesion,
		resultado: result,
		formulario: req.body,
		cursosInscritos: req.query.action,
		action:req.query.action,
		loggeado: res.locals.rol_sesion!=null,
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

	if(resultado.estado == 'ok'){
		
	}

	if(res.locals.rol_sesion=='coordinador' || res.locals.rol_sesion=='docente'){
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
	if(res.locals.rol_sesion=='coordinador' || res.locals.rol_sesion=='docente'){
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

	res.locals.sesion = undefined;
	res.locals.rol_sesion = undefined;

	res.locals.rol_sesion = res.locals.rol_sesion === undefined || res.locals.rol_sesion=='interesado'
	? 'aspirante' : res.locals.rol_sesion;

	let parametros = {
		rol: res.locals.rol_sesion,
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
		loggeado: res.locals.sesion!=null,
	});
});

app.get('/registro', (req, res) => {
	res.locals.rol_sesion = res.locals.rol_sesion === undefined || res.locals.rol_sesion=='interesado'
	? 'aspirante' : res.locals.rol_sesion;
	res.render('formCrearUsuario', {
		rol: res.locals.rol_sesion,
		loggeado: res.locals.sesion!=null,
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

io.sockets.on('connection', client => {
	console.log('un usuario se ha conectado');
	let roomSS = null;
	let	usuario = null;

	client.on('create', (room, usuarioNuevo) => {
		client.join(room);
		if (room) {
			roomSS = room;
			usuario = new Usuario();
		}

		let usuarios = usuario.agregarUsuario({
			clientId: client.id,
			nombre: usuarioNuevo,
			room: room
		});
		let txt = `${usuarioNuevo} se ha conectado`;
		io.to(roomSS).emit('nuevoUsuario', txt);
	});

	client.on('texto', (texto) => {
		io.to(roomSS).emit('texto', texto);
	});

	client.on('disconnected', () => {
		let usuarioB = usuario.borrarUsuario(client.id);
		let txt = `${usuarioB.nombre} se ha desconectado`;
		io.to(roomSS).emit('usuarioDesconectado', txt);

		client.disconnect();
	});
});

/*app.listen(process.env.PORT, () =>
	console.log('Servidor escuchando en el puerto ' + process.env.PORT)
);*/

server.listen(process.env.PORT, (err) => {
	console.log(`servidor en el puerto ${process.env.PORT}`);
});

//app.use('/css', express.static(dirNode_modules) + '/bootstrap/css');
//app.use('/js', express.static(dirNode_modules) + '/jquery');
//app.use('/js', express.static(dirNode_modules) + '/popper.js');
//app.use('/js', express.static(dirNode_modules) + '/bootstrap/js');