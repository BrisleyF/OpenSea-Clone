const Coleccion = require('../model/Coleccion');
const cloudinary  = require('cloudinary');
const fs = require('fs-extra');
const User = require('../model/User');


if (process.env.NODE_ENV !== 'production') {
	const dotenv = require('dotenv').config();
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.agregarColeccion = async (req, res) => {
    //console.log(req.body);
    //console.log(req.files);

    const { nombre, descripcion, categoria, direccionWallet, comision } = req.body;

    const result1 = await cloudinary.v2.uploader.upload(req.files['imageLogoUrl'][0].path);
    const result2 = await cloudinary.v2.uploader.upload(req.files['imageBannerUrl'][0].path);

    const userId = req.session.passport.user.id;

    const coleccion = new Coleccion({
        imageLogoUrl: result1.url,
        imageBannerUrl: result2.url,
        nombre, 
        descripcion, 
        categoria, 
        direccionWallet, 
        comision,
        public_id_logo: result1.public_id,
        public_id_banner: result2.public_id,
        user: userId
    })

    await coleccion.save();

    await fs.unlink(req.files['imageLogoUrl'][0].path)
    await fs.unlink(req.files['imageBannerUrl'][0].path)


    res.redirect('/mis/colecciones');
}

exports.mostrarColeccion = async (req, res) => {
    let id = req.params.id;
    console.log(id);

    const coleccion = await Coleccion.find({_id: id});

    res.render('coleccion', {coleccion});
}

exports.detalleNFT = async (req, res) => {
    res.render('detalle');
}

exports.agregarAlCarrito = async (req, res) => {
    res.send('carrito de compras');
}