const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notificacionSchema = new Schema({
	fechaCreacion: {
		type: Date,
		required: true
	},
	nombre: {
		type: String,
		required: true
	},
	idCurso: {
		type: String,
		required: true
	}
});

const Notificacion = mongoose.model('Notificacion', notificacionSchema);

module.exports = Notificacion;