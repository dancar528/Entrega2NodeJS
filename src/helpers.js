const hbs = require('hbs');
const { mostrarCursos, mostrarAspirantesXCurso } = require('./funciones');
//let elementos = [];

hbs.registerHelper('listar', (tipo) => {
	let elementos = listar(tipo);
	return elementos;
});

hbs.registerHelper('crearCursos', (rol) => {
	if (rol === 'coordinador') return true;
	return false;
});

hbs.registerHelper('mostrarCursos', (rol) => {
	let cursos = mostrarCursos(rol);
	return cursos;
});

hbs.registerHelper('validarCampos', (resultado, formulario, campo, claseCss, tipoForm) => {

	if (resultado && resultado['estado'] === 'error' && !formulario[campo]
		&& formulario.boton === tipoForm) {
		return ` ${claseCss}`;
	}
	return '';
});

hbs.registerHelper('alertaValidarCampos', (boton, tipoForm) => {

	if (boton === tipoForm) {
		return true;
	}
	return false;
});

hbs.registerHelper('mostrarAlerta', (resultado) => {

	if (resultado && resultado['estado'] === 'error') {
		return 'danger';
	} else if (resultado && resultado['estado'] === 'ok') {
		return 'success';
	}
	return '';
});

hbs.registerHelper('permitirInscribir', (rol) => {

	if (rol === 'interesado') {
		return true;
	} 
	return false;
});

hbs.registerHelper('mostrarFormAlInscribir', (inscribirIdCurso, actualIdCurso) => {

	if (inscribirIdCurso === actualIdCurso) {
		return ' show';
	}

	return '';
});

hbs.registerHelper('listarAspirantesXCurso', (rol) => {

	if (rol === 'coordinador') {
		return true;
	}

	return false;
});

hbs.registerHelper('mostrarAspirantesXCurso', (idCurso) => {

	let cursosAspirantes = mostrarAspirantesXCurso(idCurso);

	return cursosAspirantes;
});
