process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB;
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/educacionContinua';
} else {
	urlDB = 'mongodb+srv://dcardoh:Mayo2018@nodejstdea-f8r7w.mongodb.net/educacionContinua?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB;