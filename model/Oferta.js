const mongoose = require('mongoose'); 

const ofertaSchema = new mongoose.Schema({
    precio: { type: Number, required: true },
    diferencia: { type: Number},
    duracion: { type: Number },
    vencimiento: { type: String},
    articulo: { type: mongoose.Schema.ObjectId, ref: 'Articulo'},
    coleccion: { type: mongoose.Schema.ObjectId, ref: 'Coleccion'},
    user: { type: String},
    userName: { type: String},
    date: {type: String}
});

const Oferta = mongoose.model('Oferta', ofertaSchema); 
module.exports = Oferta;