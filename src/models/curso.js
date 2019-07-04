const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cursoSchema = new Schema({
	nombre: {
		type: String,
		required: true
	},
	id: {
		type: String,
		required: true
	},
	descripcion: {
		type: String,
		required: true
	},
	valor: {
		type: String,
		required: true
	},
	modalidad:{
		type: String
	},
	intensidad: {
		type: String
    },
    estado: {
		type: String,
		required: true
    },
    docente: {
		type: String,
		required: true
	}
});

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;