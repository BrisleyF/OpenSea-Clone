const Coleccion = require('../model/Coleccion');
const cloudinary  = require('cloudinary');
const fs = require('fs-extra');
const User = require('../model/User');
const Articulo = require('../model/Articulo');


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

    const passport = req.session.passport;

    if (!passport) {
        res.redirect('/login')
    } else {
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
            date: Date(),
            user: userId

        })

        await coleccion.save();

        await fs.unlink(req.files['imageLogoUrl'][0].path)
        await fs.unlink(req.files['imageBannerUrl'][0].path)

        res.redirect('/mis/colecciones');
    }

}

exports.mostrarColeccion = async (req, res) => {
    let id = req.params.id;
    console.log(id);

    const passport = req.session.passport;

    if (!passport) {
        res.redirect('/login');
    } else { 

        const userId = req.session.passport.user.id;
        
        const coleccion = await Coleccion.findOne({_id: id}).populate('user');

        const articulos = await Articulo.find({coleccion: id});
        console.log(articulos);
    
        res.render('coleccion', {coleccion, userId, articulos});
    }

}

exports.detalleNFT = async (req, res) => {
    res.render('detalle');
}

exports.mostarMisColecciones = async (req, res) => {

    const colecciones = await Coleccion.find({});

    res.render('mis-colecciones', {colecciones});
}

exports.mostrarFormularioArticulo = async (req, res) => {
    const id = req.params.id;

    const coleccion = await Coleccion.findOne({_id: id});

    res.render('agregar-articulo', {coleccion});
}

exports.agregarArticulo = async (req, res) => {
    const id = req.params.id;
    
    const { nombre, descripcion, precio} = req.body;

    const result = await cloudinary.v2.uploader.upload(req.files['imageArticulo'][0].path);

    const passport = req.session.passport;

    if (!passport) {
        res.redirect('/login')
    } else {
        const userId = req.session.passport.user.id;

        const articulo = new Articulo ({
            nombre,
            descripcion,
            precio,
            imageArticulo: result.url,
            user: userId,
            coleccion: id
        })

        await articulo.save();

        await fs.unlink(req.files['imageArticulo'][0].path)
    }   

    res.redirect(`/coleccion/${id}`);
}

exports.agregarAlCarrito = async (req, res) => {
    res.send('carrito de compras');
}