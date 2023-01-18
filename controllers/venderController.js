const Articulo = require('../model/Articulo');

exports.mostarFormulario = async (req, res) => {
    const id = req.params.id;
    console.log(id)

    const articulo = await Articulo.findOne({_id: id}).populate('coleccion');
    console.log(articulo)

    res.render('vender', {articulo});
}