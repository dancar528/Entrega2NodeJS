$(document).ready(() => {
console.log('daniela');
	socketPush = null;
	/*if (typeof window.formularioNotPush === 'undefined') {
		window.socketPush = io.connect();// sacarlo de aqui y que solo entre cuando se inicie sesion
		window.formularioNotPush = document.getElementsByClassName('formNotificacionPush');
		//window.idCursoNotPush = formularioNotPush.elements.id_curso.value;
	}*/
	//console.log('id_curso', formularioNotPush.elements.id_curso.value);

	btnInicioSesion = document.querySelector('#formUsuarios #btnEntrar');

	if (btnInicioSesion){
		btnInicioSesion.addEventListener('click', (event) => {
			socketPush = io.connect();

			formularioNotPush = document.getElementsByClassName('formNotificacionPush');

			socketPush.on('connect', () => {
				socketPush.emit('createPush', 'sdsdfsd');//`push_${idCursoNotPush}`);
			});
		});
	}
});

