const mongoose = require('mongoose'); 

const articuloSchema = new mongoose.Schema({
    imageArticulo: { type: String, required: true},
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true},
    creador: { type: mongoose.Schema.ObjectId, ref: 'User'},
    coleccion: { type: mongoose.Schema.ObjectId, ref: 'Coleccion'},
    propietario: { type: String },
    propietarioId: { type: String},
    date: {type: Date}
});

const Articulo = mongoose.model('Articulo', articuloSchema); 
module.exports = Articulo;