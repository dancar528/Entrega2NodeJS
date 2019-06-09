const fs = require('fs');

const cargarAspirantesCursos = () => {
	let aspirantesCursos = require('./aspirantes_cursos.json');
	return aspirantesCursos;
};

const listarCursos = () => {
	let cursos = require('./cursos.json');
	return cursos;
};

const listarAspirantes = () => {
	let aspirantes = require('./aspirantes.json');
	return aspirantes;
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

const crearAspirante = (nuevoAspirante, id_curso) => {

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

	if (camposObligatorios.length > 0) {
		resultado['camposObligatorios'] = camposObligatorios;
		resultado['estado'] = 'error';
		resultado['boton'] = 'inscribir';
		resultado['id_curso'] = id_curso;
		resultado['msg'] = 'Favor completar los campos obligatorios';
		return resultado;
	}

	let aspirantes = listarAspirantes();
	let cursosAspirantes = cargarAspirantesCursos();
	let aspirante = aspirantes.find(aspirante => aspirante.doc == nuevoAspirante.doc);
	let aspiranteCurso = [];

	if (aspirante) {
		aspiranteCurso = cursosAspirantes.find(cursoAspirante => {
			return cursoAspirante.doc_aspirante === nuevoAspirante.doc 
				&& cursoAspirante.id_curso === id_curso
		});

		if (aspiranteCurso) {
			// Aspirante ya esta inscrito en el curso
			resultado['estado'] = 'error';
			resultado['boton'] = 'inscribir';
			resultado['id_curso'] = id_curso;
			resultado['msg'] = `El aspirante con documento ${aspiranteCurso.doc_aspirante} 
				ya se encuentra matriculado en el curso con codigo ${aspiranteCurso.id_curso}`;
			return resultado;
		} else {
			aspiranteCurso = {
				doc_aspirante: nuevoAspirante.doc,
				id_curso: id_curso
			};
			cursosAspirantes.push(aspiranteCurso);
			guardarAspirantesCursos(cursosAspirantes);
			resultado['estado'] = 'ok';
			resultado['boton'] = 'inscribir';
			resultado['id_curso'] = id_curso;
			resultado['msg'] = `El aspirante con documento ${nuevoAspirante.doc} se ha 
				matriculado con exito en el curso con codigo ${id_curso}`;
			return resultado;
		}
	} else {
		aspiranteCurso = {
			doc_aspirante: nuevoAspirante.doc,
			id_curso: id_curso
		};
		delete nuevoAspirante.boton;
		delete nuevoAspirante.id_curso;
		aspirantes.push(nuevoAspirante);
		guardarAspirantes(aspirantes);
		cursosAspirantes.push(aspiranteCurso);
		guardarAspirantesCursos(cursosAspirantes);
		resultado['estado'] = 'ok';
		resultado['boton'] = 'inscribir';
		resultado['id_curso'] = id_curso;
		resultado['msg'] = `El aspirante con documento ${aspiranteCurso.doc_aspirante} se ha 
			matriculado con exito en el curso con codigo ${aspiranteCurso.id_curso}`;
		return resultado;
	}
};

const actualizarEstadoCurso = (idCurso, nuevoEstado) => {
	let resultado = [];
	let camposObligatorios = [];
	if (!idCurso) {
		camposObligatorios.push('id');
	}

	if (!nuevoEstado) {
		camposObligatorios.push('estado');
	}

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

	if (camposObligatorios) {
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

const guardarAspirantesCursos = (aspirantesCursos) => {
	let datos = JSON.stringify(aspirantesCursos);
	fs.writeFile('src/aspirantes_cursos.json', datos, (err) => {
		if (err) throw (err);
		//console.log('Se ha creado el archivo');
	});

};

const mostrarCursos = (rol) => {
	let cursos = listarCursos();

	// filtrar cursos a mostrar por rol, el rol corrdinador puede
	// ver todos los cursos incluso en estado cerrado
	if (rol === 'interesado') {
		cursos = cursos.filter(
			curso => curso.estado == 'Disponible'
		);
	}

	return cursos;
};

const eliminarAspiranteCurso = (docAspirante, idCurso) => {

	let aspirantesCursos = cargarAspirantesCursos();
	let resultado = [];
	
	let aspiranteCursoIndice = aspirantesCursos.findIndex(
		aspiranteCurso => aspiranteCurso.doc_aspirante === docAspirante
		&& aspiranteCurso.id_curso === idCurso
	);

	let aspiranteCursoEliminado = aspirantesCursos.splice(aspiranteCursoIndice, 1);

	if (aspiranteCursoEliminado.length > 0) {
		resultado['estado'] = 'ok';
		resultado['id_curso'] = idCurso;
		resultado['boton'] = 'actualizar';
		resultado['msg'] = `El aspirante con documento ${docAspirante} se elimino correctamente
			del curso con codigo ${idCurso}`;
		guardarAspirantesCursos(aspirantesCursos);
		return resultado;
	} else {
		resultado['estado'] = 'error';
		resultado['id_curso'] = idCurso;
		resultado['boton'] = 'actualizar';
		resultado['msg'] = `En este momento no es posible eliminar al aspirante con documento 
			${docAspirante} del curso con codigo ${idCurso}. Por favor intente mas tarde`;
		return resultado;
	}
};

module.exports = {
	mostrarCursos: mostrarCursos,
	crearCurso: crearCurso,
	crearAspirante: crearAspirante,
	mostrarAspirantesXCurso: mostrarAspirantesXCurso,
	eliminarAspiranteCurso: eliminarAspiranteCurso,
	actualizarEstadoCurso: actualizarEstadoCurso
};