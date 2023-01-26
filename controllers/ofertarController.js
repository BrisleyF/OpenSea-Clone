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
    let diferenciaDeprecios = 0;
    let diferencia = 0;
    let precioOferta = precio;
    

    if (anuncio.tipo == 'precio fijo' || (anuncio.tipo == 'subasta' && anuncio.metodo == 'mejor postor')) {
        let precioSalida = anuncio.precioSalida;
        diferenciaDeprecios = precioSalida - precioOferta;
        let cien = diferenciaDeprecios * 100;
        diferencia = Math.round(cien / precioSalida);
    } else {
        let precioSuelo = anuncio.precioFinal;
        diferenciaDeprecios = precioSuelo - precioOferta;
        let cien = diferenciaDeprecios * 100;
        diferencia = Math.round(cien / precioSuelo);
    }

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

    res.redirect(`/detalle/${id}`);
}