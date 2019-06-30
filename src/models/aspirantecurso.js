const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aspiranteCursoSchema = new Schema({
	id_curso: {
		type: String,
		required: true
	},
	doc_aspirante: {
		type: String,
		required: true
	}
});

const AspiranteCurso = mongoose.model('AspiranteCurso', aspiranteCursoSchema);

module.exports = AspiranteCurso;