class Usuario {
	constructor() {
		this.usuarios = [];
	}

	agregarUsuario(usuario) {
		this.usuarios.push(usuario);
		return this.usuarios;
	}
}

module.exports = {
	Usuario
};