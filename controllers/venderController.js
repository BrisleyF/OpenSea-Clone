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
    console.log(id);
    
    let userId = req.session.passport.user.id;
    const userName = req.session.passport.user.nombre;

    const articulo = await Articulo.findOne({_id: id}).populate('coleccion');

    const { tipo, metodo, precioSalida, precioFinal, duracion } = req.body;

    // vencimiento 
    let formato = 'LLL'
    let hoy = moment();
    let hoyNow = Date.now();
    let vence = hoy.clone().add(duracion, 'days').format(formato);
    let diaSegundos = 86400000;
    let multiplicacion = diaSegundos * duracion;
    let vencimientoNow = hoyNow + multiplicacion;
    //console.log("hoyNow: ",hoyNow);
    //console.log("multiplicacion: ",multiplicacion);
    //console.log("vencimientoNow: ",vencimientoNow);

    if (articulo.anunciado === false) {
        const anuncios = new Anuncio({
            tipo,
            metodo, 
            precioSalida,
            precioFinal,
            duracion,
            vencimiento: vence,
            vencimientoNow: vencimientoNow,
            articulo: articulo._id,
            coleccion: articulo.coleccion,
            ofertas: false,
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
                    anunciado: true,
                    anuncio: anuncios._id
                }
            });
        
        res.redirect(`/detalle/${id}`);

    }  else {

        const eliminarAnuncioViejo = await Anuncio.findByIdAndDelete({_id: articulo.anuncio});

        const anuncios = new Anuncio({
            tipo,
            metodo, 
            precioSalida,
            precioFinal,
            duracion,
            vencimiento: vence,
            vencimientoNow: vencimientoNow,
            articulo: articulo._id,
            coleccion: articulo.coleccion,
            ofertas: false,
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
                    anunciado: true,
                    anuncio: anuncios._id
                }
            });
        
        res.redirect(`/detalle/${id}`);

    }

}