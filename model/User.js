const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    clave: { type: String, required: true },
    date: {type: Date},
    bio: {type: String},
    imagePerfil: {type: String},
    imageBanner: {type: String},
    wallet: {
                balance: Number,
                articulos: [{ type: mongoose.Schema.ObjectId, ref: 'Articulo'}],
            }

});

const User = mongoose.model('User', userSchema); 
module.exports = User;