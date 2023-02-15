const Articulo = require('../model/Articulo');
const Carrito = require('../model/Carrito');
const Orden = require('../model/Orden');
const User = require('../model/User');
const moment = require('moment');
const Anuncio = require('../model/Anuncio');

exports.mostarCarrito = async (req, res) => {
    const userId = req.session.passport.user.id; 
    const carritos =  await Carrito.find({user: userId});

    const user = await User.findOne({_id: userId});


    let preciototal = 0

    for (let i= 0; i < carritos.length; i++){
        preciototal = preciototal + carritos[i].precio;
    }


    res.render('carrito', {carritos, preciototal, userId, user});
}

exports.agregarAlCarrito = async (req, res) => {
    const id = req.params.id;
    const userId = req.session.passport.user.id; 

    const articulo = await Articulo.findOne({ _id: id }).populate('creador').populate('coleccion'); 

    const anuncio = await Anuncio.findOne({_id: articulo.anuncio});

    const user = await User.findOne({_id: userId});

    const artCarrito = await Carrito.findOne({idArticulo: id });

    const hoy = Date.now();

    console.log(!artCarrito);
    
    if(hoy < anuncio.vencimientoNow && (!artCarrito)) {
        const carrito = new Carrito ({
            image: articulo.imageArticulo,
            nombre: articulo.nombre,
            idArticulo: articulo._id,
            creador: articulo.creador.nombre,
            creadorId: articulo.creador._id,
            propietarioId: articulo.propietarioId,
            propietario: articulo.propietario,
            precio: anuncio.precioSalida,
            anuncio: anuncio._id,
            ganancia: articulo.coleccion.comision,
            user: userId
        });
    
        await carrito.save();

        res.redirect('/carrito');
    } else {
        console.log('Se vencio el anuncio o el articulo ya existe en el carrito');
        res.redirect(`/detalle/${id}`)
    }
    
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

    const carritos = await Carrito.find({user: userId});
    
    let preciototal = 0
    for (let i= 0; i < carritos.length; i++){
        preciototal = preciototal + carritos[i].precio;
    }

    const restar = parseInt(userComprador.balance) - preciototal;
    
    let articulosArray = [];

    for (let i= 0; i < carritos.length; i++){
        articulosArray.push(carritos[i].idArticulo)

        userComprador.articulos.push(carritos[i].idArticulo);
        await userComprador.save();

        const anuncio = await Anuncio.findOne({_id: carritos[i].anuncio});


        if (userComprador.balance > anuncio.precioSalida) {

            const comprador = await User.updateOne(
                { _id: userId },
                {
                    $set: {
                        balance: restar
                    }
                });


            const articulos = await Articulo.updateMany(
                { _id: articulosArray },
                {
                    $set: {
                        propietario: userName,
                        propietarioId: userId,
                        anunciado: false
                    }
                });

            // sumar - darle el dinero al creador del cada articulo
            const userVendedor = await User.findOne({ _id: carritos[i].propietarioId });

            const userCreador = await User.findOne({_id: carritos[i].creadorId});

            const sumar = parseInt(userVendedor.balance) + carritos[i].precio;

            if (carritos[i].creadorId === carritos[i].propietarioId) {
                const vendedor = await User.updateMany(
                    { _id: carritos[i].propietarioId },
                    {
                        $set: {
                            balance: sumar
                        }
                    });
            } else {
                let comisionCreador = carritos[i].ganancia;
                let comisionXprecio = comisionCreador * carritos[i].precio;
                let resultado = comisionXprecio / 100;
            
                const sumarComision = parseInt(userCreador.balance) + resultado;

                const creador = await User.updateMany(
                    {_id: carritos[i].creadorId},
                    {
                        $set: {
                            balance: sumarComision
                        }
                    });
                
                let restaComision = carritos[i].precio - resultado;

                const montoPropietario = parseInt(userVendedor.balance) + restaComision;

                console.log(resultado);
                console.log(carritos[i].precio);
                console.log(restaComision);
                console.log(montoPropietario);

                const propietario = await User.updateMany(
                    { _id: carritos[i].propietarioId },
                    {
                        $set: {
                            balance: montoPropietario
                        }
                    });
            }
            
            // Creando actividad de compra 
            const articulo = await Articulo.findOne({ _id: carritos[i].idArticulo }).populate('coleccion');

            let formato = 'L'

            articulo.actividad.push({
                evento: 'Venta',
                imageArticulo: articulo.imageArticulo,
                nombre: articulo.nombre,
                coleccion: articulo.coleccion.nombre,
                precio: anuncio.precioSalida,
                emisor: carritos[i].propietario,
                receptor: userName,
                date: moment().format(formato)
            });

            await articulo.save();

            await Carrito.deleteMany();   

            const borrarAnuncio = await Anuncio.deleteMany({_id: anuncio._id});
            
            res.redirect('/wallet');

        } else {
            console.log('El comprador no tiene saldo suficiente en su wallet')
            res.redirect('/wallet')
        }
    }

}