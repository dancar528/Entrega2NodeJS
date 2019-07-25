class Usuario {
	constructor() {
		this.usuarios = [];
	}
/*this.usuarios = [
	
		'room1': [
		{
			'nombre': 'nombre',
			'id': 'id'
		},
		{
			'nombre': 'nombre',
			'id': 'id'
		}
		]
]
this.usuarios[this.room][1].nombre
*/
	getUsuario(id) {
		return this.usuarios.find(usuario => usuario.clientId === id);
	}

	agregarUsuario(usuario) {
		this.usuarios.push(usuario);
		console.log(this.usuarios);
		return this.usuarios;
	}

	borrarUsuario(id) {
		console.log('borrarUsuario', id);
		let usuarioBorrado = this.getUsuario(id);
		this.usuarios = this.usuarios.filter(usuario => usuario.clientId !== id);
		return usuarioBorrado;
	}

	getUsuarios() {
		return this.usuarios;
	}
}

module.exports = {
	Usuario
};