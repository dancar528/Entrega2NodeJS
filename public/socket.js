socket = null;
socket2 = null;

const formulario = document.getElementById('formChat');
const preForm = document.getElementById('preFormChat');
const content = document.getElementById('chatContent');

const formulario2 = document.getElementById('formChat2');
const preForm2 = document.getElementById('preFormChat2');
const content2 = document.getElementById('chatContent2');

content.style.display = 'none';
content2.style.display = 'none';

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
	if (!socket) {
		socket = io.connect();
	}
	//socket.join('testRoom');
	console.log('event.target', preForm);

	socket.on('connect', () => {
		console.log('connect:-------------- ', nombre);
		socket.emit('create', preForm.elements.room1);
		socket.emit('create', preForm2.elements.room2);
		socket.emit('usuarioNuevo', nombre);
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


content2.style.display = 'none';
//
document.querySelector('#preFormChat2 #unirChat2').addEventListener('click',
	(event) => {
	event.preventDefault();
	console.log(123);
	content2.style.display = 'block';
	preForm2.elements.unirChat2.style.display = 'none';
	preForm2.elements.dejarChat2.style.display = 'block';
	const nombre = preForm2.elements.nombre2.value;
//	// socket.emit('prueba');
//	//socket2 = io.connect('http://localhost:3000/cursos');
	if (!socket) {
		socket = io.connect()
	}
	socket.emit('create', preForm2.elements.room);
	console.log('event.target', preForm2);

	socket.emit('usuarioNuevo', nombre);


	socket.on('nuevoUsuario', (texto) => {
		console.log(texto);
		let node = document.createElement('P');
		let textnode = document.createTextNode(texto);
		node.appendChild(textnode);
		document.getElementById('chatContent2').appendChild(node);
	});
//
	formulario2.addEventListener('submit', (submitEvent) => {
		submitEvent.preventDefault();
		const texto = submitEvent.target.elements.texto2.value;
		socket.emit('texto', {
			texto: texto,
			nombre: nombre
		});
		console.log(123);
		//document.getElementById('chatContent').append(`<br>${nombre}: ${texto}<br>`);
	});
//
	socket.on('texto', (mensaje) => {
		console.log('texto cursos');
		let node = document.createElement('P');
		let textnode = document.createTextNode(mensaje.nombre + ': ' + mensaje.texto);
		node.appendChild(textnode);
		document.getElementById('chatContent2').appendChild(node);
	});
//
	socket.on('usuarioDesconectado', (texto) => {
		console.log(texto);
		console.log('usuarioDesconectado-----------');
		let node = document.createElement('P');
		let textnode = document.createTextNode(texto);
		node.appendChild(textnode);
		document.getElementById('chatContent2').appendChild(node);
	//	socket.disconnect();
	});
//
});
//
document.querySelector('#preFormChat2 #dejarChat2').addEventListener('click',
(event) => {
	event.preventDefault();
	console.log(event.target);
	preForm2.elements.unirChat2.style.display = 'block';
	preForm2.elements.dejarChat2.style.display = 'none';

	socket.emit('disconnected', () => {
		//socket.disconnect();
	});	

});


