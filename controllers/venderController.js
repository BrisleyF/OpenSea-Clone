const Anuncio = require('../model/Anuncio');
const Articulo = require('../model/Articulo');
const moment = require("moment");

moment.locale('es');

exports.mostarFormulario = async (req, res) => {
    const id = req.params.id;

    const articulo = await Articulo.findOne({_id: id}).populate('coleccion');

    res.render('vender', {articulo});
}

exports.enviarAnuncio = async (req, res) => {
    const id = req.params.id;
    
    let userId = req.session.passport.user.id;
    const userName = req.session.passport.user.nombre;

    const articulo = await Articulo.findOne({_id: id}).populate('coleccion');

    const { tipo, metodo, precioSalida, precioFinal, duracion } = req.body;

    // vencimiento 
    let formato = 'LLLL'
    let hoy = moment();
    let vence = hoy.clone().add(duracion, 'days').format(formato);
    
    const anuncios = new Anuncio({
        tipo,
        metodo, 
        precioSalida,
        precioFinal,
        duracion,
        vencimiento: vence,
        articulo: articulo._id,
        coleccion: articulo.coleccion,
        user: userId,
        date: hoy.format(formato)
    })

    await anuncios.save();

    articulo.actividad.push({
        evento: 'Anunciado',
        imageArticulo: articulo.imageArticulo,
        nombre: articulo.nombre,
        coleccion: articulo.coleccion.nombre,
        precio: precioSalida,
        emisor: userName,
        receptor: '',
        date: moment().format(formato)
    });
    
    await articulo.save();

    const articuloActualizado = await Articulo.updateOne(
        { _id: id },
        {
            $set: {
                anunciado: true
            }
        });
    
    res.redirect(`/detalle/${id}`);
}