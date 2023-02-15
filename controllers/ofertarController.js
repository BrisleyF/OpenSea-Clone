const Anuncio = require("../model/Anuncio");
const User = require("../model/User");
const Oferta = require("../model/Oferta");
const Articulo = require("../model/Articulo");
const moment = require("moment");

moment.locale('es');

exports.mostrarFormulario = async (req, res) => {
    const id = req.params.id;

    const userId = req.session.passport.user.id;

    const anuncio = await Anuncio.findOne({articulo: id}).populate('articulo').populate('coleccion');

    const usuario = await User.findOne({_id: userId});

    res.render('ofertar', {anuncio, usuario});
}

exports.enviarFormulario = async (req, res) => {
    const id = req.params.id;

    const userId = req.session.passport.user.id;
    const userName = req.session.passport.user.nombre;

    const {precio, duracion} = req.body;

    const anuncio = await Anuncio.findOne({articulo: id}).populate('articulo').populate('coleccion');

    // vencimiento 
    let formato = 'L'
    let hoy = moment();
    let vence = hoy.clone().add(duracion, 'days').format(formato);

    // diferencia 
    let diferenciaDeprecios = 0;
    let diferencia = 0;
    let precioOferta = precio;
    
    if (precio < anuncio.precioSalida || precio < anuncio.precioFinal) {

        if (anuncio.tipo == 'precio fijo' || (anuncio.tipo == 'subasta' && anuncio.metodo == 'mejor postor')) {
            let precioSalida = anuncio.precioSalida;
            diferenciaDeprecios = precioSalida - precioOferta;
            let cien = diferenciaDeprecios * 100;
            diferencia = Math.round(cien / precioSalida) * -1;
        } else {
            let precioSuelo = anuncio.precioFinal;
            diferenciaDeprecios = precioSuelo - precioOferta;
            let cien = diferenciaDeprecios * 100;
            diferencia = Math.round(cien / precioSuelo) * -1;
        }

    } else {

        if (anuncio.tipo == 'precio fijo' || (anuncio.tipo == 'subasta' && anuncio.metodo == 'mejor postor')) {
            let precioSalida = anuncio.precioSalida;
            diferenciaDeprecios = precioOferta - precioSalida;
            let cien = diferenciaDeprecios * 100;
            diferencia = Math.round(cien / precioSalida);
        } else {
            let precioSuelo = anuncio.precioFinal;
            diferenciaDeprecios = precioOferta - precioSuelo;
            let cien = diferenciaDeprecios * 100;
            diferencia = Math.round(cien / precioSuelo);
        }

    }


    const vencimientoAnuncio = anuncio.vencimiento;
    console.log(vencimientoAnuncio);
    console.log(hoy.format(formato));
    
    if (hoy.format(formato) < vencimientoAnuncio) {
        const ofertas = new Oferta({
            precio, 
            duracion,
            diferencia: diferencia, 
            vencimiento: vence,
            articulo: id,
            coleccion: anuncio.coleccion._id,
            user: userId,
            userName: userName,
            date: hoy.format(formato)
        });
    
        await ofertas.save();

        const anuncioActualizado = await Anuncio.updateOne(
            { articulo: id },
            {
                $set: {
                    ofertas: true
                }
            });

    } else {
        console.log('Se vencio el anuncio')
    }

    res.redirect(`/detalle/${id}`);
}