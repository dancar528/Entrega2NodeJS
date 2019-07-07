process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';
process.env.URLDB = process.env.URLDB || 'mongodb://localhost:27017/educacionContinua';

/*let urlDB;
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/educacionContinua';
} else {
	urlDB = '';
}

process.env.URLDB = urlDB;*/
