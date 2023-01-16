const Articulo = require('../model/Articulo');
const Carrito = require('../model/Carrito');
const Orden = require('../model/Orden');

exports.mostarCarrito = async (req, res) => {
    
    const carritos =  await Carrito.find({});

    let preciototal = 0

    for (let i= 0; i < carritos.length; i++){
        preciototal = preciototal + carritos[i].precio;
    }


    res.render('carrito', {carritos, preciototal});
}

exports.agregarAlCarrito = async (req, res) => {
    const id = req.params.id;

    let articulo = await Articulo.findOne({ _id: id }).populate('user').populate('coleccion'); 

    const carrito = new Carrito ({
        image: articulo.imageArticulo,
        nombre: articulo.nombre,
        idArticulo: articulo._id,
        creador: articulo.user.nombre,
        precio: articulo.precio,
        ganancia: articulo.coleccion.comision
    });

    await carrito.save();


    res.redirect('/carrito');
}


exports.eliminarArticulo = async (req, res) => {
    const id = req.params.id;

    await Carrito.findByIdAndDelete({ _id: id });

    res.redirect('/carrito');
}

exports.eliminarTodo= async (req, res) => {

    await Carrito.deleteMany();

    res.redirect('/carrito');
}