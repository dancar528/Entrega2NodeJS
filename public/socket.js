socket = null;

const formulario = document.getElementById('formChat');
const preForm = document.getElementById('preFormChat');
const content = document.getElementById('chatContent');

content.style.display = 'none';

document.querySelector('#preFormChat #unirChat').addEventListener('click',
	(event) => {
	event.preventDefault();
	console.log(123);
	content.style.display = 'block';
	preForm.elements.unirChat.style.display = 'none';
	preForm.elements.dejarChat.style.display = 'block';
	const nombre = preForm.elements.nombre.value;
	// socket.emit('prueba');
	//socket = io('/registro');
	//socket = io.connect('http://localhost:3000/registro');
	//if (!socket) {
		socket = io.connect();
	//}
	//socket.join('testRoom');
	console.log('event.target', preForm);

	socket.on('connect', () => {
		console.log('connect:-------------- ', nombre);
		console.log('preForm.elements.room:-------------- ', preForm.elements.room);
		socket.emit('create', preForm.elements.room.value, nombre);
		//socket.emit('usuarioNuevo', nombre);
	});

	socket.on('nuevoUsuario', (texto) => {
		console.log(texto);
		let node = document.createElement('P');
		let textnode = document.createTextNode(texto);
		node.appendChild(textnode);
		document.getElementById('chatContent').appendChild(node);
	});

	formulario.addEventListener('submit', (submitEvent) => {
		submitEvent.preventDefault();
		const texto = submitEvent.target.elements.texto.value;
		socket.emit('texto', {
			texto: texto,
			nombre: nombre
		});
		console.log(123);
		//document.getElementById('chatContent').append(`<br>${nombre}: ${texto}<br>`);
	});

	socket.on('texto', (mensaje) => {
		console.log('texto cliente!!');
		let node = document.createElement('P');
		let textnode = document.createTextNode(mensaje.nombre + ': ' + mensaje.texto);
		node.appendChild(textnode);
		document.getElementById('chatContent').appendChild(node);
	});

	socket.on('usuarioDesconectado', (texto) => {
		console.log(texto);
		console.log('usuarioDesconectado-----------');
		let node = document.createElement('P');
		let textnode = document.createTextNode(texto);
		node.appendChild(textnode);
		document.getElementById('chatContent').appendChild(node);
	//	socket.disconnect();
	});

});

document.querySelector('#preFormChat #dejarChat').addEventListener('click',
(event) => {
	event.preventDefault();
	console.log(event.target);
	preForm.elements.unirChat.style.display = 'block';
	preForm.elements.dejarChat.style.display = 'none';

	socket.emit('disconnected', () => {
		//socket.disconnect();
	});	

});
