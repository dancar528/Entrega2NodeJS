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

	//Generamos un evento onclick para el botón de las notificaciones
	$(".buttonNotifications").on('click',function(){

		if($('#ventanaNotificacion').is(':visible')){
			$('#ventanaNotificacion').hide();
		}else{
			$('#ventanaNotificacion').show();
		}

	});
	socket = io.connect();
	socket.on('notificacion', (mensaje) => {
		console.log(mensaje);
		notifyMe(mensaje);
		var number = Number($("#numNotification").html()) + 1;
		$("#listNotification").append(mensaje);
		$("#numNotification").html(number);
	});
});

function notifyMe(mensaje) {
	if (Notification.permission !== 'granted')
	 Notification.requestPermission();
	else {
	 var notification = new Notification('Notificacion', {
	  body: mensaje,
	 });
	}
   }

