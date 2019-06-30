const fs = require('fs');
const bcrypt = require('bcrypt');
const UsuarioModel = require('./models/usuario');
const AspiranteModel = require('./models/aspirante');
const CursoModel = require('./models/curso');
const AspiranteCursoModel = require('./models/aspirantecurso');

const cargarAspirantesCursos = async () => {
	return new Promise(function(resolve, reject) {
		AspiranteCursoModel.find({}).exec((error,result)=>{
			if(error)//return [];
				throw error;

			resolve(result);
		});
	});
};

const cargarAspirantesCursosPorIdCurso = async(idCurso) => {
	AspiranteCursoModel.find({id_curso:idCurso}).exec((error,result)=>{
		if(error)//return [];
			throw error;

		return result;
	});
};

const listarCursos = async () => {
	return new Promise(function(resolve, reject) {
		CursoModel.find({}).exec((error,result)=>{
			if(error)//return [];
				throw error;

			resolve(result);
		});
	});

};

const listarAspirantes = async () => {

	return new Promise(function(resolve, reject) {
		AspiranteModel.find({}).exec((error,result)=>{
			if(error)//return [];
				throw error;
			
			resolve(result);
		});
	});
	
};

const listarAspirantesLista = async() =>{
	return new Promise(function(resolve, reject) {
	AspiranteModel.find({}).exec((error,result)=>{
		if(error){//return [];
			throw error;
		}
		
		resolve(result);
	});
	});
};

const listarUsuarios = async () => {

	return new Promise(function(resolve, reject) {
		UsuarioModel.find({}).exec((error,result)=>{
			if(error)//return [];
				throw error;
		
			resolve(result);
		});
	});
};

const listarUsuarioMongoDB = (doc, password, callback) => {
	let usuario = {};
	UsuarioModel.findOne({doc: doc}).exec((err, usuario) => {
		if (err) {
			callback(null);
			return;
		}
		if (!usuario || !bcrypt.compareSync(password, usuario.password)) {
			callback(null);
			return;
		}
		callback(usuario);
	});
};

const mostrarAspirantesXCurso = async () => {
	let resultado = [];
	let aspirantesCursos =  await cargarAspirantesCursos();

	let aspirantes = await listarAspirantesLista();

	resultado['aspirantes']=aspirantes;
	resultado['aspirantescursos']=aspirantesCursos;
	//console.log(resultado);
	return resultado;
};

const crearCurso = async(nuevoCurso) => {

	let resultado = [];
	let camposObligatorios = [];

	if (!nuevoCurso.id) {
		camposObligatorios.push('id');
	}
	if (!nuevoCurso.nombre) {
		camposObligatorios.push('nombre');
	}
	if (!nuevoCurso.descripcion) {
		camposObligatorios.push('descripcion');
	}
	if (!nuevoCurso.valor) {
		camposObligatorios.push('valor');
	}

	if (camposObligatorios.length > 0) {
		resultado['estado'] = 'error';
		resultado['boton'] = 'crear';
		resultado['camposObligatorios'] = camposObligatorios;
		resultado['msg'] = 'Favor completar los campos obligatorios';
		return resultado;
	}

	let cursos = await listarCursos();
	let curso = cursos.find(curso => curso.id == nuevoCurso.id);

	if (typeof curso !== 'undefined'){
		// curso no se puede crear ya que codigo ya existe
		resultado['estado'] = 'error';
		resultado['boton'] = 'crear';
		resultado['msg'] = `El curso con codigo ${curso.id} ya existe`;
		return resultado;
	} else {
		nuevoCurso.estado = 'Disponible';
		nuevoCurso.docente = 'Sin definir docente';
		let cursoGuardado = await guardarCursos(nuevoCurso);
		resultado['boton'] = 'crear';
		if(cursoGuardado){
			resultado['estado'] = 'ok';
			resultado['msg'] = `Curso con codigo ${nuevoCurso.id} creado correctamente`;
		}else{
			resultado['estado'] = 'error';
			resultado['boton'] = 'crear';
			resultado['msg'] = `No se pudo crear el curso con id ${nuevoCurso.id}`;
		}
		return resultado;
	}
};

const crearAspirante = async (nuevoAspirante) => {

	let resultado = [];
	let camposObligatorios = [];

	if (!nuevoAspirante.doc) {
		camposObligatorios.push('doc');
	} 
	if (!nuevoAspirante.nombre) {
		camposObligatorios.push('nombre');
	}
	if (!nuevoAspirante.correo) {
		camposObligatorios.push('correo');
	}
	if (!nuevoAspirante.telefono) {
		camposObligatorios.push('telefono');
	}
	if (!nuevoAspirante.password) {
		camposObligatorios.push('password');
	}

	if (camposObligatorios.length > 0) {
		resultado['camposObligatorios'] = camposObligatorios;
		resultado['estado'] = 'error';
		resultado['boton'] = nuevoAspirante.boton;
		resultado['rol'] = 'interesado';
		resultado['msg'] = 'Favor completar los campos obligatorios';
		return resultado;
	}

	let aspirantes = await listarAspirantes();
	let aspirante = false;

	if(typeof aspirantes!=='undefined'){
		aspirante= aspirantes.find(aspirante => aspirante.doc == nuevoAspirante.doc);
	}
	if (aspirante) {
		resultado['estado'] = 'error';
		resultado['boton'] = nuevoAspirante.boton;
		resultado['rol'] = 'interesado';
		resultado['msg'] = `Ya existe un usuario con el documento ${nuevoAspirante.doc}`;
		return resultado;
	} else {
		let defaultRol = 'aspirante';
		let usuario = {
			doc: nuevoAspirante.doc,
			password: bcrypt.hashSync(nuevoAspirante.password, 10),
			rol: defaultRol
		};
		resultado['boton'] = nuevoAspirante.boton;
		resultado['rol'] = defaultRol;

		guardarAspiranteMongoDB(nuevoAspirante);
	
		guardarUsuarioMongoDB(usuario);
	
		resultado['estado'] = 'ok';
		resultado['msg'] = `Usuario registrado correctamente!. Recuerda ingresar con el documento`;
		return resultado;
	}
};

const crearAspiranteCurso = async (nuevoAspiranteCurso) => {

	let resultado = [];
	let camposObligatorios = [];
	if (!nuevoAspiranteCurso.doc_aspirante) {
		camposObligatorios.push('doc_aspirante');
	} 
	if (!nuevoAspiranteCurso.id_curso) {
		camposObligatorios.push('id_curso');
	}

	if (camposObligatorios.length > 0) {
		resultado['camposObligatorios'] = camposObligatorios;
		resultado['estado'] = 'error';
		resultado['action'] = nuevoAspiranteCurso.action;
		resultado['id_curso'] = nuevoAspiranteCurso.id_curso;
		resultado['doc_aspirante'] = nuevoAspiranteCurso.doc_aspirante;
		resultado['boton'] = nuevoAspiranteCurso.boton;
		resultado['msg'] = 'Favor completar los campos obligatorios';
		return resultado;
	}

	let cursosAspirantes = await cargarAspirantesCursos();
	let cursoAspirante=null;
	if(typeof cursosAspirantes!=='undefined'){
			cursoAspirante = cursosAspirantes.find(
				(cursoAspirante) => cursoAspirante.doc_aspirante == nuevoAspiranteCurso.doc_aspirante
					&& cursoAspirante.id_curso == nuevoAspiranteCurso.id_curso
			);
	}

	if (typeof cursoAspirante!=='undefined') {
		resultado['estado'] = 'error';
		resultado['id_curso'] = cursoAspirante.id_curso;
		resultado['action'] = nuevoAspiranteCurso.action;
		resultado['doc_aspirante'] = nuevoAspiranteCurso.doc_aspirante;
		resultado['boton'] = nuevoAspiranteCurso.boton;
		resultado['msg'] = `Usted ya se encuentra matriculado en el curso con codigo ${cursoAspirante.id_curso}`;
		return resultado;
	}
	resultado['action'] = nuevoAspiranteCurso.action;
	resultado['boton'] = nuevoAspiranteCurso.boton;

	let aspiranteCursoGuardado = await guardarAspirantesCursos(nuevoAspiranteCurso);

	resultado['doc_aspirante'] = nuevoAspiranteCurso.doc_aspirante;
	resultado['id_curso'] = nuevoAspiranteCurso.id_curso;
	if(aspiranteCursoGuardado){
		resultado['estado'] = 'ok';
		resultado['msg'] = `Inscripcion exitosa en el curso ${nuevoAspiranteCurso.id_curso}`;
	}else{
		resultado['estado'] = 'error';
		resultado['msg'] = `No se pudo inscribir el aspirante al curso ${nuevoAspiranteCurso.id_curso}`;
	}
	return resultado;
};

const actualizarEstadoCurso = async(idCurso, nuevoEstado, docente) => {
	let resultado = [];
	let camposObligatorios = [];
	
	if (!idCurso) {
		camposObligatorios.push('id');
	}

	/*if (!nuevoEstado) {
		camposObligatorios.push('estado');
	}*/

	if (camposObligatorios.length > 0) {
		resultado['camposObligatorios'] = camposObligatorios;
		resultado['estado'] = 'error';
		resultado['boton'] = 'actualizar';
		resultado['id_curso'] = idCurso;
		resultado['msg'] = 'Favor completar los campos obligatorios';
		return resultado;
	}

	let cursos = await listarCursos();
	let cursoIndice=-1;
	if(typeof cursos!=='undefined'){
		cursoIndice = cursos.findIndex(curso => curso.id == idCurso);
	}

	if (cursoIndice < 0){
		resultado['estado'] = 'error';
		resultado['boton'] = 'actualizar';
		resultado['id_curso'] = idCurso;
		resultado['msg'] = `No existe curso con codigo ${idCurso}. 
			Por tanto no se realiza ninguna actualizacion`;
		return resultado;
	} else {
		cursos[cursoIndice].estado = nuevoEstado ? nuevoEstado : 'Disponible'; 
		cursos[cursoIndice].docente = docente ? docente : 'Sin docente asignado';

		let nuevoCurso = cursos[cursoIndice];

		let cursoActualizado = await actualizarCursoMongo(nuevoCurso);
		
		if(cursoActualizado){
			resultado['estado'] = 'ok';
			resultado['boton'] = 'actualizar';
			resultado['id_curso'] = idCurso;
			resultado['msg'] = `Curso con codigo ${idCurso} actualizado correctamente`;
		}else{
			resultado['estado'] = 'error';
			resultado['boton'] = 'actualizar';
			resultado['id_curso'] = idCurso;
			resultado['msg'] = `No se pudo actualizar el curso con id ${idCurso}`;
		}
		return resultado;
	}
};

const actualizarCursoMongo = async (curso) =>{
	return new Promise(function(resolve, reject) {
		CursoModel.findOneAndUpdate({id:curso.id},
			{$set:{
				estado:curso.estado,
				docente:curso.docente
			}},(error,result)=>{
			if(error)//return false;
				throw error;
	
			resolve(true);	
		});
	});
}

const actualizarCurso = (cursoAModificar) => {

	let resultado = [];
	let camposObligatorios = [];

	if (!cursoAModificar.id) {
		camposObligatorios.push('id');
	}

	if (camposObligatorios.length > 0) {
		resultado['camposObligatorios'] = camposObligatorios;
		resultado['estado'] = 'error';
		resultado['msg'] = 'Favor completar los campos obligatorios';
		return resultado;
	}

	let cursos =  listarCursos();

	let curso;

	if (typeof cursos !== 'undefined'){
		 curso = cursos.find(curso => curso.id == cursoAModificar.id);
	}

	if (typeof curso === 'undefined'){
		resultado['estado'] = 'error';
		resultado['msg'] = `No existe curso con codigo ${curso.id}. 
			Por tanto no se realiza ninguna actualizacion`;
		return resultado;
	} else {
		// si actualizan el curso, validar que solo se actualicen los siguientes campos
		// si no vienen vacios
		if (cursoAModificar.nombre) {
			curso.nombre = cursoAModificar.nombre;
		}
		if (cursoAModificar.descripcion) {
			curso.descripcion = cursoAModificar.descripcion;
		}
		if (cursoAModificar.valor) {
			curso.valor = cursoAModificar.valor;
		}
		if (cursoAModificar.modalidad) {
			curso.modalidad = cursoAModificar.modalidad;
		}
		if (cursoAModificar.intensidad) {
			curso.intensidad = cursoAModificar.intensidad;
		}
		if (cursoAModificar.estado) {
			curso.estado = cursoAModificar.estado;
		}
		let cursoGuardado =  guardarCursos(curso);
		if(cursoGuardado){
			resultado['estado'] = 'ok';
			resultado['msg'] = `Curso con codigo ${curso.id} actualizado correctamente`;
		}else{
			resultado['estado'] = 'error';
			resultado['msg'] = `No se pudo guardar el curso con id  ${curso.id}`;
		}
		return resultado;
	}
};

const guardarCursos = async (cursos) => {
	// let datos = JSON.stringify(cursos);
	// fs.writeFile('src/cursos.json', datos, (err) => {
	// 	if (err) throw (err);
	// });

	let nuevoCurso = new CursoModel({
		id:cursos.id,
		nombre:cursos.nombre,
		descripcion:cursos.descripcion,
		valor:cursos.valor,
		modalidad:cursos.modalidad,
		intensidad:cursos.intensidad,
		estado:cursos.estado,
		docente:cursos.docente
	});


	return new Promise(function(resolve, reject) {
		nuevoCurso.save((error,result)=>{
			if(error)//return false;
				throw error;
			
			resolve(true);
		});
	});
	
};

const guardarAspirantes = (aspirantes) => {
	let datos = JSON.stringify(aspirantes);
	fs.writeFile('src/aspirantes.json', datos, (err) => {
		if (err) throw (err);
	});

};

const guardarAspiranteMongoDB = (aspirante) => {
	let nuevoAspirante = new AspiranteModel({
		doc: aspirante.doc,
		nombre: aspirante.nombre,
		correo: aspirante.correo,
		telefono: aspirante.telefono
	});
	
	nuevoAspirante.save((err, resultado) => {
		if (err) {
			return console.log(err);
		}
	});

};

const guardarUsuarioMongoDB = (usuario) => {
	let nuevoUsuario = new UsuarioModel({
		doc: usuario.doc,
		password: usuario.password,
		rol: usuario.rol
	});
	nuevoUsuario.save((err, resultado) => {
		if (err) {
			return console.log(err);
		}
	});

};

const guardarUsuarios = (usuarios) => {
	let datos = JSON.stringify(usuarios);
	fs.writeFile('src/usuarios.json', datos, (err) => {
		if (err) throw (err);
	});
	

};

const guardarAspirantesCursos = async (aspirantesCursos) => {
	// let datos = JSON.stringify(aspirantesCursos);
	// fs.writeFileSync('src/aspirantes_cursos.json', datos,'utf8');

	let nuevoAspiranteCurso = new AspiranteCursoModel({
		id_curso:aspirantesCursos.id_curso,
		doc_aspirante:aspirantesCursos.doc_aspirante
	});
	return new Promise(function(resolve, reject) {
		nuevoAspiranteCurso.save((error,result)=>{
			if(error)//return false;
				throw error;

			resolve(true);
		});
	});
};

const mostrarUsuarios = async () => {

	let aspirantes = await listarAspirantes();
	let usuarios = await listarUsuarios();

	aspirantes.forEach((aspirante, indice) => {
		let usuario = usuarios.find((usuario) => usuario.doc == aspirante.doc);

		if (usuario) {
			aspirantes[indice].rol = usuario.rol;
		}
	});

	return aspirantes;
};

const mostrarCursos = async (rol, doc, action) => {
	let cursos =  await listarCursos();
	// filtrar cursos a mostrar por rol, el rol corrdinador puede
	// ver todos los cursos incluso en estado cerrado
	if (!rol || action == 'cursos_disponibles') {

		if(typeof cursos!=='undefined'){
			cursos = cursos.filter(
				curso => curso.estado == 'Disponible'
			);
		}
		return cursos;
	} else if (rol == 'aspirante') {
		let nuevoCursos = [];
		let aspirantesCursos = await cargarAspirantesCursos();
		let aspiranteCursos;
		if(typeof cursos!=='undefined'){
			aspiranteCursos = aspirantesCursos.filter(
				aspiranteCurso => aspiranteCurso.doc_aspirante == doc
			);
			aspiranteCursos.forEach((aspiranteCurso, indice) => {
				let curso = cursos.find(
					curso => curso.id == aspiranteCurso.id_curso
				);
				if (typeof curso!=='undefined') {
					nuevoCursos.push(curso);
				}
			});
		}
		return nuevoCursos;
	} else if (rol == 'docente') {
		let nuevoCursos = [];
		if(typeof cursos!=='undefined'){
			nuevoCursos = cursos.filter(
				curso => curso.docente == doc
			);
		}
		return nuevoCursos;
	}
	return cursos;
};

const eliminarAspiranteCurso = async(docAspirante, idCurso) => {

	let aspirantesCursos = await cargarAspirantesCursos();
	let resultado = [];
	let aspiranteCursoEliminado=null;
	if(typeof aspirantesCursos!=='undefined'){
		aspiranteCursoEliminado = aspirantesCursos.filter(
			lista => lista.doc_aspirante!=docAspirante || lista.id_curso!=idCurso);
	}

	if (aspiranteCursoEliminado!=null) {

		//guardarAspirantesCursos(aspiranteCursoEliminado);
		let aspiranteCursoEliminado = await eliminarAspiranteCursoMongoDB(docAspirante,idCurso);

		if(aspiranteCursoEliminado){
			resultado['estado'] = 'ok';
			resultado['id_curso'] = idCurso;
			resultado['boton'] = 'remover';
			resultado['msg'] = `El aspirante con documento ${docAspirante} se elimino correctamente
				del curso con codigo ${idCurso}`;
		}else{
			resultado['estado'] = 'error';
			resultado['id_curso'] = idCurso;
			resultado['boton'] = 'remover';
			resultado['msg'] = `En este momento no es posible eliminar al aspirante con documento 
				${docAspirante} del curso con codigo ${idCurso}. Por favor intente mas tarde`;
		}
		return resultado;
	} else {
		resultado['estado'] = 'error';
		resultado['id_curso'] = idCurso;
		resultado['boton'] = 'remover';
		resultado['msg'] = `En este momento no es posible eliminar al aspirante con documento 
			${docAspirante} del curso con codigo ${idCurso}. Por favor intente mas tarde`;
		return resultado;
	}
};

const eliminarAspiranteCursoMongoDB = async (docAspirante,idCurso) => {
	return new Promise(function(resolve, reject) {
		AspiranteCursoModel.findOneAndDelete({doc_aspirante:docAspirante,id_curso:idCurso},(error,result) =>{
			if(error)
				throw error;
			
			resolve(true);
		});
	});	
};

const actualizarUsuario = async (nuevosDatos) => {
	nuevosDatos.doc = nuevosDatos.doc_trigger;

	if (nuevosDatos[`rol${nuevosDatos.doc}`]) {
		nuevosDatos.rol = nuevosDatos[`rol${nuevosDatos.doc}`];
	}

	let resultado = [];
	let camposObligatorios = [];
	if (!nuevosDatos.doc) {
		camposObligatorios.push('doc');
	} 
	if (!nuevosDatos.nombre) {
		camposObligatorios.push('nombre');
	}
	if (!nuevosDatos.correo) {
		camposObligatorios.push('correo');
	}
	if (!nuevosDatos.telefono) {
		camposObligatorios.push('telefono');
	}
	if (!nuevosDatos.rol) {
		camposObligatorios.push('rol');
	}
	if (camposObligatorios.length > 0) {
		resultado['camposObligatorios'] = camposObligatorios;
		resultado['estado'] = 'error';
		resultado['boton'] = nuevosDatos.boton;
		resultado['doc_trigger'] = nuevosDatos.doc_trigger;
		resultado['msg'] = 'Favor completar los campos obligatorios';
		return resultado;
	}

	let actualizarUsuarioMongo = await actualizarUserMongo(nuevosDatos);

	if(actualizarUsuarioMongo){
		resultado['estado'] = 'ok';
		resultado['rol'] = 'interesado';
	 	resultado['msg'] = 'Usuario actualizado correctamente!';
	}else{
		resultado['estado'] = 'error';
		resultado['rol'] = 'interesado';
	 	resultado['msg'] = 'No se pudo actualizar el usuario';
	}

	return resultado;
};

const actualizarUserMongo = async (user) =>{
	const res = () => {
		return new Promise(function(resolve, reject) {
			UsuarioModel.findOneAndUpdate({doc:user.doc},user,{new:true},(error,result)=>{
				if(error)
					throw error;
				
				resolve(true);
			});
		});
	};

	let result = await res();
	return result;
};

const ingresar = (usuarioAValidar, callback) => {
	let resultado = [];
	let camposObligatorios = [];

	if (!usuarioAValidar.doc) {
		camposObligatorios.push('doc');
	}
	if (!usuarioAValidar.password) {
		camposObligatorios.push('password');
	}
	if (camposObligatorios.length > 0) {
		resultado['camposObligatorios'] = camposObligatorios;
		resultado['estado'] = 'error';
		resultado['msg'] = 'Favor completar los campos obligatorios';
		//return resultado;
	callback(resultado);
	return;

	}

	//let usuarios = listarUsuarios();
	listarUsuarioMongoDB(
		usuarioAValidar.doc,
		usuarioAValidar.password,
		(usuario) => {
			//let usuario = usuarios.find(usuario =>
			//	usuario.doc == usuarioAValidar.doc
			//		&& bcrypt.compareSync(usuarioAValidar.password, usuario.password)
			//);
			if (usuario == null) {
				resultado['estado'] = 'error';
				resultado['rol'] = '';
				resultado['msg'] = 'No existe usuario con la información ingresada';
				callback(resultado);
				return;

			}
			resultado['estado'] = 'ok';
			resultado['rol'] = usuario.rol;
			resultado['msg'] = 'ok';
			callback(resultado);
		}
	);
};

const listarDocentes = async () => {
	let usuarios = await listarUsuarios();
	let usuariosDocentes = usuarios.filter((usuario) => usuario.rol === 'docente');

	if (usuariosDocentes.length === 0) return [];
	let docentes = [];

	usuariosDocentes.forEach(async(usuario, indice) => {
		let aspirantes = await listarAspirantes();
		let docente = aspirantes.find((aspirante) => aspirante.doc === usuario.doc);
		docentes.push(docente);
	});

	return docentes;
};

const consultarAspirante = (doc, callback) => {
	let aspirante = {};
	//aspirante = listarAspirantes().find((aspirante) => aspirante.doc === doc);
	AspiranteModel.findOne({doc: doc}).exec((err, aspirante) => {
		if (err) {
			console.log(err);
			callback(null);
			return;
		}
		callback(aspirante);
	});
};

const mostrarCursosLista = async(rol, doc, action) => {

	let cursos = await mostrarCursos(rol,doc,action);
	return cursos;
}

const mostrarAspirantesXCursoLista = async()=>{
	let result = await mostrarAspirantesXCurso();
	return result;
}

module.exports = {
	mostrarCursos: mostrarCursos,
	mostrarCursosLista: mostrarCursosLista,
	mostrarAspirantesXCursoLista:mostrarAspirantesXCursoLista,
	crearCurso: crearCurso,
	crearAspirante: crearAspirante,
	mostrarAspirantesXCurso: mostrarAspirantesXCurso,
	eliminarAspiranteCurso: eliminarAspiranteCurso,
	actualizarEstadoCurso: actualizarEstadoCurso,
	ingresar: ingresar,
	crearAspiranteCurso: crearAspiranteCurso,
	mostrarUsuarios: mostrarUsuarios,
	actualizarUsuario: actualizarUsuario,
	listarDocentes: listarDocentes,
	consultarAspirante: consultarAspirante
};