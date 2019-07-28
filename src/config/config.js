process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';
process.env.URLDB = process.env.URLDB || 'mongodb://localhost:27017/educacionContinua';
process.env.SENDGRID_API_KEY = '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';
//process.env.CHAT_PORT = process.env.CHAT_PORT || 8080;

/*let urlDB;
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/educacionContinua';
} else {
	urlDB = 'mongodb+srv://dcardoh:Mayo2018@nodejstdea-f8r7w.mongodb.net/educacionContinua?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB;*/
