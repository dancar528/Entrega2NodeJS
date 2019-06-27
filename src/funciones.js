const fs = require('fs');
const bcrypt = require('bcrypt');

const cargarAspirantesCursos = () => {
	//let aspirantesCursos = null;
	//aspirantesCursos = require('./aspirantes_cursos.json');
	//return aspirantesCursos;
	try{
		let jsonData = JSON.parse(fs.readFileSync('src/aspirantes_cursos.json', 'utf-8'));
		return jsonData;
	}catch(error){
		return [];
	}
	
};

const listarCursos = () => {
	let cursos = require('./cursos.json');
	return cursos;
};

const listarAspirantes = () => {
	let aspirantes = require('./aspirantes.json');
	return aspirantes;
};

const listarUsuarios = () => {
	let usuarios = require('./usuarios.json');
	return usuarios;
};

const mostrarCursosAspirantes = () => {
	let cursos = listarCursos();
	let aspirantesCursos = cargarAspirantesCursos();

	cursos.forEach((curso, indice) => {
		let aspirantesCurso = aspirantesCursos.filter(
			aspiranteCurso => aspiranteCurso.id_curso == curso.id
		);
		cursos[indice].aspirantes = aspirantesCurso;
	});

	return cursos;
};

const mostrarAspirantesXCurso = (idCurso) => {

	let aspirantesCursos = cargarAspirantesCursos();
	let aspirantesCurso = aspirantesCursos.filter(aspiranteCurso => aspiranteCurso.id_curso === idCurso);
	let aspirantes = listarAspirantes();
	let aspirantesInfoCompleta = [];

	aspirantesCurso.forEach((aspiranteCurso, indice) => {
		aspirantesInfoCompleta.push(
			aspirantes.find(aspirante => aspirante.doc === aspiranteCurso.doc_aspirante)
		);
	});

	return aspirantesInfoCompleta;
};

const crearCurso = (nuevoCurso) => {

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

	let cursos = listarCursos();
	let curso = cursos.find(curso => curso.id == nuevoCurso.id);

	if (typeof curso !== 'undefined'){
		// curso no se puede crear ya que codigo ya existe
		resultado['estado'] = 'error';
		resultado['boton'] = 'crear';
		resultado['msg'] = `El curso con codigo ${curso.id} ya existe`;
		return resultado;
	} else {
		nuevoCurso.estado = (nuevoCurso.estado) ? nuevoCurso.estado : 'Disponible';
		delete nuevoCurso.boton;
		cursos.push(nuevoCurso);

		guardarCursos(cursos);
		resultado['estado'] = 'ok';
		resultado['boton'] = 'crear';
		resultado['msg'] = `Curso con codigo ${nuevoCurso.id} creado correctamente`;
		return resultado;
	}
};

const crearAspirante = (nuevoAspirante) => {

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

	let aspirantes = listarAspirantes();
	let aspirante = aspirantes.find(aspirante => aspirante.doc == nuevoAspirante.doc);

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
		delete nuevoAspirante.boton;
		delete nuevoAspirante.password;
		delete nuevoAspirante.doc_trigger;
		aspirantes.push(nuevoAspirante);
		guardarAspirantes(aspirantes);
		let usuarios = listarUsuarios();
		usuarios.push(usuario);
		guardarUsuarios(usuarios);
		resultado['estado'] = 'ok';
		resultado['msg'] = `Usuario registrado correctamente!. Recuerda ingresar con el documento`;
		return resultado;
	}
};

const crearAspiranteCurso = (nuevoAspiranteCurso) => {

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

	let cursosAspirantes = cargarAspirantesCursos();
	let cursoAspirante = cursosAspirantes.find(
		(cursoAspirante) => cursoAspirante.doc_aspirante === nuevoAspiranteCurso.doc_aspirante
			&& cursoAspirante.id_curso === nuevoAspiranteCurso.id_curso
	);
	if (cursoAspirante) {
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
	delete nuevoAspiranteCurso.action;
	delete nuevoAspiranteCurso.boton;

	cursosAspirantes.push(nuevoAspiranteCurso);
	guardarAspirantesCursos(cursosAspirantes);
	resultado['estado'] = 'ok';
	resultado['doc_aspirante'] = nuevoAspiranteCurso.doc_aspirante;
	resultado['id_curso'] = nuevoAspiranteCurso.id_curso;
	resultado['msg'] = `Inscripcion exitosa en el curso ${nuevoAspiranteCurso.id_curso}`;
	return resultado;
};

const actualizarEstadoCurso = (idCurso, nuevoEstado, docente) => {
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

	let cursos = listarCursos();
	let cursoIndice = cursos.findIndex(curso => curso.id == idCurso);

	if (cursoIndice < 0){
		resultado['estado'] = 'error';
		resultado['boton'] = 'actualizar';
		resultado['id_curso'] = idCurso;
		resultado['msg'] = `No existe curso con codigo ${idCurso}. 
			Por tanto no se realiza ninguna actualizacion`;
		return resultado;
	} else {
		cursos[cursoIndice].estado = nuevoEstado; 
		cursos[cursoIndice].docente = docente;
		guardarCursos(cursos);
		resultado['estado'] = 'ok';
		resultado['boton'] = 'actualizar';
		resultado['id_curso'] = idCurso;
		resultado['msg'] = `Curso con codigo ${idCurso} actualizado correctamente`;
		return resultado;
	}
};

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

	let cursos = listarCursos();
	let curso = cursos.find(curso => curso.id == cursoAModificar.id);

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
		guardarCursos(cursos);
		resultado['estado'] = 'ok';
		resultado['msg'] = `Curso con codigo ${curso.id} actualizado correctamente`;
		return resultado;
	}
};

const guardarCursos = (cursos) => {
	let datos = JSON.stringify(cursos);
	fs.writeFile('src/cursos.json', datos, (err) => {
		if (err) throw (err);
	});
};

const guardarAspirantes = (aspirantes) => {
	let datos = JSON.stringify(aspirantes);
	fs.writeFile('src/aspirantes.json', datos, (err) => {
		if (err) throw (err);
		//console.log('Se ha creado el archivo');
	});

};

const guardarUsuarios = (usuarios) => {
	let datos = JSON.stringify(usuarios);
	fs.writeFile('src/usuarios.json', datos, (err) => {
		if (err) throw (err);
		//console.log('Se ha creado el archivo');
	});
	

};

const guardarAspirantesCursos = (aspirantesCursos) => {
	let datos = JSON.stringify(aspirantesCursos);
	fs.writeFileSync('src/aspirantes_cursos.json', datos,'utf8');
};

const mostrarUsuarios = () => {

	let aspirantes = listarAspirantes();
	let usuarios = listarUsuarios();

	aspirantes.forEach((aspirante, indice) => {
		let usuario = usuarios.find((usuario) => usuario.doc == aspirante.doc);

		if (usuario) {
			aspirantes[indice].rol = usuario.rol;
		}
	});

	return aspirantes;
};

const mostrarCursos = (rol, doc, action) => {
	let cursos = listarCursos();
	// filtrar cursos a mostrar por rol, el rol corrdinador puede
	// ver todos los cursos incluso en estado cerrado
	if (!rol || action == 'cursos_disponibles') {
		cursos = cursos.filter(
			curso => curso.estado == 'Disponible'
		);
		return cursos;
	} else if (rol == 'aspirante') {
		let nuevoCursos = [];
		let aspirantesCursos = cargarAspirantesCursos();
		let aspiranteCursos = aspirantesCursos.filter(
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
		return nuevoCursos;
	} else if (rol == 'docente') {
		let nuevoCursos = [];
		nuevoCursos = cursos.filter(
			curso => curso.docente == doc
		);
		return nuevoCursos;
	}
	return cursos;
};

const eliminarAspiranteCurso = (docAspirante, idCurso) => {

	let aspirantesCursos = cargarAspirantesCursos();
	let resultado = [];
	let aspiranteCursoEliminado = aspirantesCursos.filter(
		lista => lista.doc_aspirante!=docAspirante || lista.id_curso!=idCurso);

	if (aspiranteCursoEliminado!=null) {
		resultado['estado'] = 'ok';
		resultado['id_curso'] = idCurso;
		resultado['boton'] = 'remover';
		resultado['msg'] = `El aspirante con documento ${docAspirante} se elimino correctamente
			del curso con codigo ${idCurso}`;
		guardarAspirantesCursos(aspiranteCursoEliminado);
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

const actualizarUsuario = (nuevosDatos) => {
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

	let usuarios = listarUsuarios();	
	let usuarioIndice = usuarios.findIndex(usuario => usuario.doc === nuevosDatos.doc);
	let aspirantes = listarAspirantes();
	let aspiranteIndice = aspirantes.findIndex(aspirante => aspirante.doc === nuevosDatos.doc);

	if (usuarioIndice >= 0) {

		if (usuarios[usuarioIndice].rol !== nuevosDatos.rol) {
			usuarios[usuarioIndice].rol = nuevosDatos.rol;
			guardarUsuarios(usuarios);
		}
	}
	if (aspiranteIndice >= 0) {
		let nuevoAspirante = nuevosDatos;
		resultado['boton'] = nuevosDatos.boton;
		resultado['doc_trigger'] = nuevosDatos.doc_trigger;
		resultado['rol'] = nuevoAspirante.rol;

		delete nuevoAspirante.rol;
		delete nuevoAspirante.boton;
		delete nuevoAspirante.doc_trigger;
		delete nuevoAspirante[`rol${nuevosDatos.doc}`];

		aspirantes[aspiranteIndice] = nuevoAspirante;
		guardarAspirantes(aspirantes);

		resultado['estado'] = 'ok';
		//resultado['rol'] = 'interesado';
		resultado['msg'] = 'Usuario actualizado correctamente!';
		return resultado;
	}
};

const ingresar = (usuarioAValidar) => {
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
		return resultado;
	}

	let usuarios = listarUsuarios();
	let usuario = usuarios.find(usuario => 
		usuario.doc == usuarioAValidar.doc
			&& bcrypt.compareSync(usuarioAValidar.password, usuario.password)
	);

	if (!usuario) {
		resultado['estado'] = 'error';
		resultado['rol'] = '';
		resultado['msg'] = 'No existe usuario con la información ingresada';
		return resultado;
	}
	resultado['estado'] = 'ok';
	resultado['rol'] = usuario.rol;
	resultado['msg'] = 'ok';
	return resultado;
};

const listarDocentes = () => {
	let usuarios = listarUsuarios();
	let usuariosDocentes = usuarios.filter((usuario) => usuario.rol === 'docente');

	if (usuariosDocentes.length === 0) return [];
	let docentes = [];

	usuariosDocentes.forEach((usuario, indice) => {
		let docente = listarAspirantes().find((aspirante) => aspirante.doc === usuario.doc);
		docentes.push(docente);
	});

	return docentes;
};

const consultarAspirante = (doc) => {
	let aspirante = {};
	aspirante = listarAspirantes().find((aspirante) => aspirante.doc === doc);

	return aspirante;
};

module.exports = {
	mostrarCursos: mostrarCursos,
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