socket = null;

const formulario = document.getElementById('formChat');
const preForm = document.getElementById('preFormChat');
const content = document.getElementById('chatContent');
const contentMessages = document.getElementById('chatContentMessages');

document.querySelector('#preFormChat #unirChat').addEventListener('click',
	(event) => {
	event.preventDefault();
	preForm.elements.unirChat.style.display = 'none';
	preForm.elements.dejarChat.style.display = 'block';
	const nombre = preForm.elements.nombre.value;
	//socket = io('/registro');
	//socket = io.connect('http://localhost:3000/registro');
	//if (!socket) {
		socket = io.connect();
	//}

	socket.on('connect', () => {
		socket.emit('create', preForm.elements.room.value, nombre);
	});

	socket.on('nuevoUsuario', (texto) => {
		let node = document.createElement('P');
		let textnode = document.createTextNode(texto);
		node.appendChild(textnode);
		contentMessages.appendChild(node);
	});

	formulario.addEventListener('submit', (submitEvent) => {
		submitEvent.preventDefault();
		const texto = submitEvent.target.elements.texto.value;
		socket.emit('texto', {
			texto: texto,
			nombre: nombre
		});
	});

	socket.on('texto', (mensaje) => {
		let node = document.createElement('P');
		let textnode = document.createTextNode(mensaje.nombre + ': ' + mensaje.texto);
		node.appendChild(textnode);
		contentMessages.appendChild(node);
		shouldScroll = contentMessages.scrollTop + contentMessages.clientHeight === contentMessages.scrollHeight;

		if (!shouldScroll) {
		    scrollToBottom();
		}
	});

	socket.on('usuarioDesconectado', (texto) => {
		let node = document.createElement('P');
		let textnode = document.createTextNode(texto);
		node.appendChild(textnode);
		contentMessages.appendChild(node);
	});

});

function scrollToBottom() {
  contentMessages.scrollTop = contentMessages.scrollHeight;
}

document.querySelector('#preFormChat #dejarChat').addEventListener('click',
(event) => {
	event.preventDefault();
	preForm.elements.unirChat.style.display = 'block';
	preForm.elements.dejarChat.style.display = 'none';

	socket.emit('disconnected', () => {
		//socket.disconnect();
	});	

});

formUpload = document.getElementById('formUpload');

formUpload.addEventListener('submit', (event) => {
	console.log('submit');
	let id_curso = event.target.elements.id_curso.value;
	window.socketPush.emit('nuevoUpload', {
		room: `push_${id_curso}`,
		id_curso: id_curso
	});

	window.socketPush.on('textoPush', (texto) => {
		console.log(texto);
	});
});
