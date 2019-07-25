class Usuario {
	constructor() {
		this.usuarios = [];
	}

	getUsuario(id) {
		return this.usuarios.find(usuario => usuario.clientId === id);
	}

	agregarUsuario(usuario) {
		this.usuarios.push(usuario);
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