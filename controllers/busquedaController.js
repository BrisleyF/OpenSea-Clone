const Anuncio = require("../model/Anuncio");
const Articulo = require("../model/Articulo");    

exports.busqueda = async (req, res) => {

    if(req.query.buscar) {
		
        console.log(req.query.buscar);
    
        const articulos = await Articulo.find({ nombre: { $regex: '.*' + req.query.buscar + '.*', $options: 'i' } }).populate('coleccion');
    
        res.render('busqueda', { articulos, valor: req.query.buscar });
    
    } else {
        res.redirect('/')
    }
}