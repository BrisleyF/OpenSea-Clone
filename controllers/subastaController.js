const Anuncio = require('../model/Anuncio');
const Oferta = require('../model/Oferta');
const User = require('../model/User');
const Articulo = require ('../model/Articulo');
const moment = require('moment');

exports.subasta = async (req, res) => {
    const id = req.params.id;

    const anuncios = await Anuncio.find({articulo: id}).populate('articulo');

    const ofertas = await Oferta.find({ articulo: id}).sort({precio: -1}).populate('user');

    res.render('subasta', {ofertas, anuncios});
}

exports.transferir = async (req, res) => {
    const id = req.params.id;
    const userId = req.session.passport.user.id; 
    const userName = req.session.passport.user.nombre;

    const oferta = await Oferta.findOne({_id: id}).populate('articulo').populate('coleccion');

    const userComprador = await User.findOne({_id: oferta.user});

    const restar = parseInt(userComprador.balance) - oferta.precio;

    const userPropietario = await User.findOne({_id: oferta.articulo.propietarioId});
    
    const sumar = parseInt(userPropietario.balance) + oferta.precio;
    
    const userCreador = await User.findOne({_id: oferta.articulo.creador});

    if (userComprador.balance > oferta.precio) {

        const comprador = await User.updateOne(
            { _id: oferta.user },
            {
                $set: {
                    balance: restar
                }
            });
    
            userComprador.articulos.push(oferta.articulo);
            await userComprador.save();

            console.log(oferta.articulo.creador);
            console.log(oferta.articulo.propietarioId);
            console.log("diferente: ",oferta.articulo.creador.toString() != oferta.articulo.propietarioId.toString());
            console.log("iguales: ",oferta.articulo.creador.toString() === oferta.articulo.propietarioId.toString());
    
            if (oferta.articulo.creador.toString() === oferta.articulo.propietarioId.toString()) {
                const vendedor = await User.updateOne(
                    { _id: oferta.articulo.propietarioId },
                    {
                        $set: {
                            balance: sumar
                        }
                    });
            } else {
                let comisionCreador = oferta.coleccion.comision;
                let comisionXprecio = comisionCreador * oferta.precio;
                let resultado = comisionXprecio / 100;
            
                const sumarComision = parseInt(userCreador.balance) + resultado;

                const creador = await User.updateOne(
                    { _id: oferta.articulo.creador},
                    {
                        $set: {
                            balance: sumarComision
                        }
                    });
                
                let restaComision = oferta.precio - resultado;

                const montoPropietario = parseInt(userPropietario.balance) + restaComision;

                console.log(resultado);
                console.log(oferta.precio);
                console.log(sumarComision);
                console.log(restaComision);
                console.log(montoPropietario);

                const propietario = await User.updateOne(
                    { _id: oferta.articulo.propietarioId },
                    {
                        $set: {
                            balance: montoPropietario
                        }
                    });
            }

    
        const articulo = await Articulo.findOne({_id: oferta.articulo}).populate('coleccion').populate('anuncio');
    
        let formato = 'L'
    
        articulo.actividad.push({
            evento: 'Transferido',
            imageArticulo: articulo.imageArticulo,
            nombre: articulo.nombre,
            coleccion: articulo.coleccion.nombre,
            precio: articulo.anuncio.precioSalida,
            emisor: userName,
            receptor: oferta.userName,
            date: moment().format(formato)
        });
            
        await articulo.save();
    
        const articuloActualizado = await Articulo.updateOne(
            { _id: oferta.articulo },
            {
                $set: {
                    propietario: oferta.userName,
                    propietarioId: oferta.user,
                    anunciado: false
                    }
            });
    
        const borrarOfertas = await Oferta.deleteMany({articulo: oferta.articulo});    
    
        const borrarAnuncio = await Anuncio.deleteMany({articulo: oferta.articulo});
    
        res.redirect('/wallet');

    } else {
        console.log('El comprador no tiene suficiente saldo en su wallet ')
        res.redirect(`/subasta/${oferta.articulo}`);
    }
    

    
}