const mongoose = require('mongoose'); 

const articuloSchema = new mongoose.Schema({
    imageArticulo: { type: String, required: true},
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true},
    user: { type: mongoose.Schema.ObjectId, ref: 'User'},
    coleccion: { type: mongoose.Schema.ObjectId, ref: 'Coleccion'},
    date: {type: Date}
});

const Articulo = mongoose.model('Articulo', articuloSchema); 
module.exports = Articulo;