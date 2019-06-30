const hbs = require('hbs');
const {
	mostrarCursos,
	mostrarAspirantesXCurso,
	mostrarAspirantesXCursoLista,
	mostrarUsuarios,
	listarDocentes,
	mostrarCursosLista
} = require('./funciones');

const deasync = require('deasync');

hbs.registerHelper('listar', (tipo) => {
	let elementos = listar(tipo);
	return elementos;
});

hbs.registerHelper('listarAspirantesXCursos', (rol) => {
	if (rol == 'coordinador' || rol == 'docente') return true;
	return false;
});

hbs.registerHelper('mostrarCursos', (rol, doc, action) => {
	let resultado;
	mostrarCursosLista(rol, doc, action).then(function(result){
		resultado = result;
	});

	while(resultado === undefined) {
		deasync.runLoopOnce();
	}
	return resultado;
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
	if (resultado && resultado['estado'] == 'error') {
		return 'danger';
	} else if (resultado && resultado['estado'] == 'ok') {
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

	if (inscribirIdCurso == actualIdCurso) {
		return ' show';
	}
	return '';
});

hbs.registerHelper('mostrarAspirantesXCurso', (idCurso) => {
	let cursosAspirantes;

	return [];
});

hbs.registerHelper('listarAspirantesPorCurso', (lista,idCurso) => {
	let aspirantes = lista.aspirantes;
	let aspirantecursos = lista.aspirantescursos;
	let curso = aspirantecursos.filter(aspiranteCurso => aspiranteCurso.id_curso === idCurso);

	let resultado = []
	curso.forEach((aspiranteCurso, indice) => {
		let aspirante1 = aspirantes.find(aspirante => aspirante.doc == aspiranteCurso.doc_aspirante)
		resultado.push(aspirante1);
	});
	return resultado;
});

hbs.registerHelper("setVar", function(varName, varValue, options) {
	options.data.root[varName] = varValue;
});

hbs.registerHelper('mostrarUsuarios', (rol) => {
	let usuarios;
	if (rol == 'coordinador') {
		mostrarUsuarios().then(function(result){
			usuarios = result;
		});

		while(usuarios === undefined) {
			deasync.runLoopOnce();
		}
		return usuarios;
	}
	usuarios=[];
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
