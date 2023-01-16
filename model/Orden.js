const mongoose = require('mongoose'); 
const { stringify } = require('uuid');

const ordenSchema = new mongoose.Schema({
    nombre: { type: String },
    userId: { type: String },
    articulos: { type: mongoose.Schema.ObjectId, ref: 'Carrito'},
    total: { type: Number },
    date: {type: Date}
});

const Orden = mongoose.model('Orden', ordenSchema); 
module.exports = Orden;