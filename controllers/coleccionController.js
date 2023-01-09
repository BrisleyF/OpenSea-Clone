
exports.mostrarColeccion = async (req, res) => {
    res.render('coleccion');
}

exports.detalleNFT = async (req, res) => {
    res.render('detalle');
}

exports.agregarAlCarrito = async (req, res) => {
    res.send('carrito de compras');
}