const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const initDb = require('./libs/db-connection');
const routes = require('./routes');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const multer = require('multer');
const  {  v4 : uuidv4  }  =  require ( 'uuid' );
const User = require('./model/User');

const MONGO_URL = 'mongodb://localhost:27017/openSea';

if (process.env.NODE_ENV !== 'production') {
	const dotenv = require('dotenv').config();
}

const app = express();


// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// session 
app.use(session({
	secret: 'esto es un secreto',
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
		mongoUrl: MONGO_URL,
		autoReconnect: true
	})
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((usuario, done) => done(null, { id: usuario._id, nombre: usuario.nombre }));
passport.deserializeUser(async(usuario, done) => {
	const userDb = await User.findById(usuario.id);
	return done(null, { id: userDb._id, nombre: userDb.nombre })
})

// Multer configuracion
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename: (req, file, cb, filename) => {
        console.log(file);
        cb(null, uuidv4() + path.extname(file.originalname));
    }
}) 
app.use(multer({storage}).fields([
	{ name: 'imageLogoUrl', maxCount: 1 }, { name: 'imageBannerUrl', maxCount: 1 },
	{ name: 'imagePerfil', maxCount: 1 }, { name: 'imageBanner', maxCount: 1 },
	{ name: 'imageArticulo', maxCount: 1 }
]));



// Rutas de la App
app.use('/', routes());


const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
	console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);
	console.log(process.env.NODE_ENV)
});

initDb();

module.exports = app

