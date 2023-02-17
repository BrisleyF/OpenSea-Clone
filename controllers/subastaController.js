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

    const restar = parseInt(userComprador.balanceDiferido) - oferta.precio;

    const userPropietario = await User.findOne({_id: oferta.articulo.propietarioId});
    
    const sumar = parseInt(userPropietario.balance) + oferta.precio;
    
    const userCreador = await User.findOne({_id: oferta.articulo.creador});

    if (userComprador.balanceDiferido >= oferta.precio) {

        const comprador = await User.updateOne(
            { _id: oferta.user },
            {
                $set: {
                    balanceDiferido: restar
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

                console.log('precio de la oferta', oferta.precio);
                console.log('% comision', resultado);
                console.log('balance del creador + %', sumarComision);
                console.log('precio de la oferta - %', restaComision);
                console.log('balance del propietario + restaComision ', montoPropietario);

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

        const eliminarOfertaGanadora = await Oferta.deleteOne({_id: id});    

        const ofertas = await Oferta.find({articulo: oferta.articulo}).populate('user'); 
        
        for (let i= 0; i < ofertas.length; i++) {

            const precioOferta = ofertas[i].precio;

            const userOferta = await User.findOne({_id: ofertas[i].user});

            const restarBalanceDiferido = userOferta.balanceDiferido - precioOferta;

            const sumarBalance = userOferta.balance + precioOferta;

            const actualizar = await User.updateOne(
                { _id: ofertas[i].user },
                {
                    $set: {
                        balance: sumarBalance,
                        balanceDiferido: restarBalanceDiferido 
                    }
                });
        }
    
        const borrarOfertas = await Oferta.deleteMany({articulo: oferta.articulo});    
    
        const borrarAnuncio = await Anuncio.deleteMany({articulo: oferta.articulo});
    
        res.redirect('/wallet');

    } else {
        console.log('El comprador no tiene suficiente saldo en su wallet ')
        res.redirect(`/subasta/${oferta.articulo}`);
    }
    

    
}