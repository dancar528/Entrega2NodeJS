const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
	doc: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	rol: {
		type: String,
		required: true
	}
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;