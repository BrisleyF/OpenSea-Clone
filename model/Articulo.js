const mongoose = require('mongoose'); 

const articuloSchema = new mongoose.Schema({
    imageArticulo: { type: String, required: true},
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    creador: { type: mongoose.Schema.ObjectId, ref: 'User'},
    coleccion: { type: mongoose.Schema.ObjectId, ref: 'Coleccion'},
    propietario: { type: String },
    propietarioId: { type: mongoose.Schema.ObjectId, ref: 'User'},
    anunciado: { type: Boolean },
    anuncio: { type: mongoose.Schema.ObjectId, ref: 'Anuncio'},
    actividad: { type: Array },
    date: {type: String}
});

const Articulo = mongoose.model('Articulo', articuloSchema); 
module.exports = Articulo;