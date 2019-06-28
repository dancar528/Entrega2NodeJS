const mongoose = require('mongoose');
const Schema = mongoose.Schema;
console.log('----------------+++++++++++++++');
const aspiranteSchema = new Schema({
	doc: {
		type: String,
		required: true
	},
	nombre: {
		type: String,
		required: true
	},
	correo: {
		type: String,
		required: true
	},
	telefono: {
		type: String,
		required: true
	}
});

const Aspirante = mongoose.model('Aspirante', aspiranteSchema);

module.exports = Aspirante;