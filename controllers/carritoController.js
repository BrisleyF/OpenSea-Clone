const Articulo = require('../model/Articulo');
const Carrito = require('../model/Carrito');
const Orden = require('../model/Orden');
const User = require('../model/User');

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

    let articulo = await Articulo.findOne({ _id: id }).populate('creador').populate('coleccion'); 

    const carrito = new Carrito ({
        image: articulo.imageArticulo,
        nombre: articulo.nombre,
        idArticulo: articulo._id,
        creador: articulo.creador.nombre,
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

exports.eliminarTodo = async (req, res) => {

    await Carrito.deleteMany();

    res.redirect('/carrito');
}

exports.comprar = async (req, res) => {
    const userId = req.session.passport.user.id; 
    const userName = req.session.passport.user.nombre;

    const {wallet} = req.body;

    const user = await User.findOne({_id: wallet});

    const carritos = await Carrito.find({});
    
    let preciototal = 0
    for (let i= 0; i < carritos.length; i++){
        preciototal = preciototal + carritos[i].precio;
    }

    const restar = parseInt(user.wallet.balance) - preciototal;
    
    let articulos = [];
    for (let i= 0; i < carritos.length; i++){
        articulos.push(carritos[i].idArticulo)
    }

    const usuario = await User.updateOne(
        { _id: wallet },
        {
            $set: {
                wallet: {
                    balance: restar,
                    articulos: articulos
                }
            }
        });

        const articulo = await Articulo.updateOne(
            { _id: articulos },
            {
                $set: {
                    propietario: userName,
                    propietarioId: userId
                }
            });

    await Carrito.deleteMany();    
    res.redirect('/wallet');
}