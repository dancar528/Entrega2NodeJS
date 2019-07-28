const mongoose = require('mongoose');
const Schema = mongoose.Schema;
console.log('----------------+++++++++++++++');
const moduloSchema = new Schema({
	fechaCreacion: {
		type: Date,
		required: true
	},
	ruta: {
		type: Buffer,
		required: true
    },
    nombre:{
        type: String,
		required: true
    },
	idCurso: {
		type: String,
		required: true
	}
});

const Modulo = mongoose.model('Modulo', moduloSchema);

module.exports = Modulo;