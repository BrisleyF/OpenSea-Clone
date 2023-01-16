const mongoose = require('mongoose'); 

const coleccionSchema = new mongoose.Schema({
    imageLogoUrl: { type: String, required: true},
    imageBannerUrl: { type: String, required: true},
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    categoria: { type: String, required: true },
    direccionWallet: { type: String, required: true },
    comision: { type: String, required: true },
    public_id_logo: { type: String},
    public_id_banner: { type: String},
    user: { type: mongoose.Schema.ObjectId, ref: 'User'},
    date: {type: Date}
});

const Coleccion = mongoose.model('Coleccion', coleccionSchema); 
module.exports = Coleccion;