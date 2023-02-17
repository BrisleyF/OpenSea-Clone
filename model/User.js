const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    clave: { type: String, required: true },
    date: { type: Date },
    bio: { type: String },
    imagePerfil: { type: String },
    imageBanner: { type: String },
    balance: { type: Number },
    balanceDiferido: { type: Number },
    articulos: { type: Array}

});

const User = mongoose.model('User', userSchema); 
module.exports = User;