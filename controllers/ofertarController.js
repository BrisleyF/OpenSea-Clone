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

    const usuario = await User.findOne({_id: userId}).populate('wallet');

    res.render('ofertar', {anuncio, usuario});
}

exports.enviarFormulario = async (req, res) => {
    const id = req.params.id;

    const userId = req.session.passport.user.id;
    const userName = req.session.passport.user.nombre;

    const {precio, duracion} = req.body;

    const anuncio = await Anuncio.findOne({articulo: id}).populate('articulo').populate('coleccion');

    // vencimiento 
    let formato = 'LLLL'
    let hoy = moment();
    let vence = hoy.clone().add(duracion, 'days').format(formato);

    // diferencia 
    if (anuncio.tipo == 'precio fijo') {
        let precioSalida = anuncio.precioSalida;
        let precioOferta = precio;
        let diferenciaDeprecios = precioSalida - precioOferta;
        let cien = diferenciaDeprecios * 100;
        let diferencia = Math.round(cien / precioSalida);

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

    } else if (anuncio.tipo == 'subasta' && anuncio.metodo == 'mejor postor') {
        let precioSalida = anuncio.precioSalida;
        let precioOferta = precio;
        let diferenciaDeprecios = precioSalida - precioOferta;
        let cien = diferenciaDeprecios * 100;
        let diferencia = Math.round(cien / precioSalida);

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
    } else {
        let precioSuelo = anuncio.precioFinal;
        let precioOferta = precio;
        let diferenciaDeprecios = precioSuelo - precioOferta;
        let cien = diferenciaDeprecios * 100;
        let diferencia = Math.round(cien / precioSuelo);
    
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
    }

    res.redirect(`/detalle/${id}`);
}