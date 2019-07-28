const mongoose = require('mongoose');
const Schema = mongoose.Schema;
console.log('----------------+++++++++++++++');
const notificacionSchema = new Schema({
	fechaCreacion: {
		type: Date,
		required: true
	},
	mensaje: {
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