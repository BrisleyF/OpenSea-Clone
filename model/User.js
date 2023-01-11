const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    clave: { type: String, required: true },
    date: {type: Date}
});

const User = mongoose.model('User', userSchema); 
module.exports = User;