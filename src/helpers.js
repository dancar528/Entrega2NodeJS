const hbs = require('hbs');
const {
	mostrarCursos,
	mostrarAspirantesXCurso,
	mostrarUsuarios,
	listarDocentes
} = require('./funciones');

hbs.registerHelper('listar', (tipo) => {
	let elementos = listar(tipo);
	return elementos;
});

hbs.registerHelper('listarAspirantesXCursos', (rol) => {
	if (rol === 'coordinador' || rol === 'docente') return true;
	return false;
});

hbs.registerHelper('mostrarCursos', (rol, doc, action) => {
	let cursos = mostrarCursos(rol, doc, action);
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
	if (boton == tipoForm) {
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

hbs.registerHelper('permitirInscribir', (rol,action) => {
	if (rol == 'aspirante' && action =='cursos_disponibles') {
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

hbs.registerHelper('mostrarAspirantesXCurso', (idCurso) => {

	let cursosAspirantes = mostrarAspirantesXCurso(idCurso);

	return cursosAspirantes;
});

hbs.registerHelper('mostrarUsuarios', (rol) => {
	let usuarios = [];
	if (rol == 'coordinador') {
		usuarios = mostrarUsuarios();
	}

	return usuarios;
});

hbs.registerHelper('mostrarPorRol', (rolActual, rolPermitido, rolPermitido2) => {

	if (rolActual === rolPermitido || rolActual === rolPermitido2) {
		return true;
	}

	return false;
});

hbs.registerHelper('listarDocentes', () => {
	let docentes = listarDocentes();

	return docentes;
});

hbs.registerHelper('append', (cadena1, cadena2) => {
	return `${cadena1}${cadena2}`;
});

hbs.registerHelper('ifeq', function (a, b, options) {
    if (a == b) { return options.fn(this); }
    return options.inverse(this);
});

hbs.registerHelper('ifnoteq', function (a, b, options) {
    if (a != b) { return options.fn(this); }
    return options.inverse(this);
});
