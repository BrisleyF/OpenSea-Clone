const mongoose = require('mongoose'); 
const { stringify } = require('uuid');

const carritoSchema = new mongoose.Schema({
    nombre: { type: String },
    idArticulo: { type: String },
    creador: { type: String },
    precio: { type: Number },
    ganancia: { type: String },
    image: { type: String },
    date: {type: Date}
});

const Carrito = mongoose.model('Carrito', carritoSchema); 
module.exports = Carrito;