const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const initDb = require('./libs/db-connection');
const splide = require('@splidejs/splide');

const app = express();

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/', (req, res) => {
	res.render('home');
});

app.get('/tienda/:id', (req, res) => {
	res.render('tienda');
})

app.get('/detalle/:id', (req, res) => {
	res.render('detalle');
})

app.get('/register', (req, res) => {
	res.render('register');
})

app.get('/login', (req, res) => {
	res.render('login');
})

app.get('/logout', (req, res) => {
	res.redirect('register');
})

app.get('/perfil', (req, res) => {
	res.render('perfil');
})

app.get('/perfil/creado', (req, res) => {
	res.render('perfil-creado');
})


const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
	console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);
});

initDb();

