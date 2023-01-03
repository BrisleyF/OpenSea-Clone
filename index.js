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

app.get('/tiendas', (req, res) => {
	res.render('tiendas');
})

const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
	console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);
});

initDb();

