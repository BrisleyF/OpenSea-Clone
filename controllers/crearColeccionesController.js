const Coleccion = require('../model/Coleccion');

exports.crearColeccion = async (req, res) => {
    res.render('crear-colecciones');
}

exports.mostarMisColecciones = async (req, res) => {

    const colecciones = await Coleccion.find({});

    res.render('mis-colecciones', {colecciones});
}

exports.agregarArticulo = async (req, res) => {
    res.render('agregar-articulo');
}