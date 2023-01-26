const Articulo = require('../model/Articulo');
const Carrito = require('../model/Carrito');
const Orden = require('../model/Orden');
const User = require('../model/User');
const moment = require('moment');

exports.mostarCarrito = async (req, res) => {
    const userId = req.session.passport.user.id; 
    const carritos =  await Carrito.find({});

    let preciototal = 0

    for (let i= 0; i < carritos.length; i++){
        preciototal = preciototal + carritos[i].precio;
    }


    res.render('carrito', {carritos, preciototal, userId});
}

exports.agregarAlCarrito = async (req, res) => {
    const id = req.params.id;

    let articulo = await Articulo.findOne({ _id: id }).populate('creador').populate('coleccion'); 

    const carrito = new Carrito ({
        image: articulo.imageArticulo,
        nombre: articulo.nombre,
        idArticulo: articulo._id,
        creador: articulo.creador.nombre,
        creadorId: articulo.creador._id,
        propietarioId: articulo.propietarioId,
        propietario: articulo.propietario,
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

    const userComprador = await User.findOne({_id: userId});

    const carritos = await Carrito.find({});
    
    let preciototal = 0
    for (let i= 0; i < carritos.length; i++){
        preciototal = preciototal + carritos[i].precio;
    }

    const restar = parseInt(userComprador.wallet.balance) - preciototal;
    
    let articulos = [];
    for (let i= 0; i < carritos.length; i++){
        articulos.push(carritos[i].idArticulo)
    }

    const comprador = await User.updateOne(
        { _id: userId },
        {
            $set: {
                wallet: {
                    balance: restar,
                    articulos: articulos
                }
            }
        });

    const articulo = await Articulo.updateMany(
        { _id: articulos },
        {
            $set: {
                propietario: userName,
                propietarioId: userId
                }
        });

    // sumar - darle el dinero al creador del cada articulo

    
    for (let i= 0; i < carritos.length; i++){

        const userVendedor = await User.findOne({_id: carritos[i].propietarioId});

        const sumar = parseInt(userVendedor.wallet.balance) + carritos[i].precio;

        const vendedor = await User.updateMany(
            { _id: carritos[i].propietarioId },
            {
                $set: {
                    wallet: {
                        balance: sumar
                    }
                }
            });

        // Creando actividad de compra 

        const articulo = await Articulo.findOne({_id: carritos[i].idArticulo}).populate('coleccion');

        let formato = 'LLLL'

        articulo.actividad.push({
            evento: 'Venta',
            imageArticulo: articulo.imageArticulo,
            nombre: articulo.nombre,
            coleccion: articulo.coleccion.nombre,
            precio: articulo.precio,
            emisor: carritos[i].propietario,
            receptor: userName,
            date: moment().format(formato)
        });
        
        await articulo.save();
    }
    

    await Carrito.deleteMany();    
    res.redirect('/wallet');
}