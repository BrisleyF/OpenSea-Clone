const Anuncio = require('../model/Anuncio');
const Articulo = require('../model/Articulo');

exports.mostarFormulario = async (req, res) => {
    const id = req.params.id;

    const articulo = await Articulo.findOne({_id: id}).populate('coleccion');

    res.render('vender', {articulo});
}

exports.enviarAnuncio = async (req, res) => {
    const id = req.params.id;
    
    let userId = req.session.passport.user.id;

    const articulo = await Articulo.findOne({_id: id});

    const { tipo, metodo, precioSalida, precioFinal, duracion } = req.body;
    
    const anuncios = new Anuncio({
        tipo,
        metodo, 
        precioSalida,
        precioFinal,
        duracion,
        articulo: articulo._id,
        coleccion: articulo.coleccion,
        user: userId,
        date: Date()
    })

    await anuncios.save();
    

    res.redirect('/')
}