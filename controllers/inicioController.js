const Coleccion = require("../model/Coleccion");


exports.inicio = async (req, res) => {
    

    const colecciones = await Coleccion.find({})

    res.render('home', {colecciones});
};