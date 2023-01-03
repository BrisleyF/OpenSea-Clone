const mongoose = require('mongoose');

let db;

module.exports = function Connection() {
    if(!db) {
        console.log('se inicio la base de datos');
        mongoose.set('strictQuery', true);
        db = mongoose.connect('mongodb://localhost:27017/openSea');
    }

    return db; 
}