const mongoose = require('mongoose'); 

const anuncioSchema = new mongoose.Schema({
    tipo: { type: String, required: true},
    metodo: { type: String },
    precioSalida: { type: Number, required: true },
    precioFinal: { type: Number},
    duracion: { type: Number },
    vencimiento: { type: String},
    articulo: { type: mongoose.Schema.ObjectId, ref: 'Articulo'},
    coleccion: { type: mongoose.Schema.ObjectId, ref: 'Coleccion'},
    user: { type: String},
    date: {type: String}
});

const Anuncio = mongoose.model('Anuncio', anuncioSchema); 
module.exports = Anuncio;