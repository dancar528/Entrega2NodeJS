socket = null;

const formulario = document.getElementById('formChat');
const preForm = document.getElementById('preFormChat');
const content = document.getElementById('chatContent');
content.style.display = 'none';

document.querySelector('#preFormChat').addEventListener('submit',
	(event) => {
	event.preventDefault();
	console.log(123);
	content.style.display = 'block';
	event.target.elements.chat.style.display = 'none';
	const nombre = event.target.elements.nombre.value;
	// socket.emit('prueba');
	socket = io();
	console.log('event.target', event.target);
	socket.on('connect', () => {
		console.log('connect:-------------- ', nombre);
		socket.emit('usuarioNuevo', nombre);
	});

	socket.on('nuevoUsuario', (texto) => {
		console.log(texto);
		let node = document.createElement('P');
		let textnode = document.createTextNode(texto);
		node.appendChild(textnode);
		document.getElementById('chatContent').appendChild(node);
	});

	formulario.addEventListener('submit', (event) => {
		event.preventDefault();
		const texto = event.target.elements.texto.value;
		socket.emit('texto', {
			texto: texto,
			nombre: nombre
		});
		console.log(123);
		//document.getElementById('chatContent').append(`<br>${nombre}: ${texto}<br>`);
	});

	socket.on('texto', (mensaje) => {
		let node = document.createElement('P');
		let textnode = document.createTextNode(mensaje.nombre + ': ' + mensaje.texto);
		node.appendChild(textnode);
		document.getElementById('chatContent').appendChild(node);
	});
});


/*

*/
/*
// del cliente al servidor
socket.on('mensaje', (mensaje) => {
	console.log(mensaje);
});

// del servidor al cliente
socket.emit('mensaje', 'estoy conectado');

// del servidor al cliente
socket.emit('contador');

socket.on('contador', (contador) => {
	console.log(contador);
});


*/


