
exports.crearColeccion = async (req, res) => {
    res.render('crear-colecciones');
}

exports.mostarMisColecciones = async (req, res) => {
    res.render('mis-colecciones');
}

exports.agregarArticulo = async (req, res) => {
    res.render('agregar-articulo');
}