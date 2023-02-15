const mongoose = require('mongoose'); 


const carritoSchema = new mongoose.Schema({
    nombre: { type: String },
    idArticulo: { type: mongoose.Schema.ObjectId, ref: 'Articulo'},
    creador: { type: String },
    creadorId: { type: String},
    propietarioId: { type: String},
    propietario: {type: String },
    precio: { type: Number },
    anuncio: { type: mongoose.Schema.ObjectId, ref: 'Anuncio'},
    ganancia: { type: Number },
    user: { type: mongoose.Schema.ObjectId, ref: 'User'},
    image: { type: String },
    date: {type: Date}
});

const Carrito = mongoose.model('Carrito', carritoSchema); 
module.exports = Carrito;