const User = require('../model/User');
const cloudinary  = require('cloudinary');
const fs = require('fs-extra');
const Articulo = require('../model/Articulo');
const Anuncio = require('../model/Anuncio');
const Coleccion = require('../model/Coleccion');

if (process.env.NODE_ENV !== 'production') {
	const dotenv = require('dotenv').config();
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


exports.mostrarPerfil = async (req, res) => {
    let userId = req.session.passport.user.id;
    let userName = req.session.passport.user.nombre;

    const usuario = await User.findOne({_id: userId});

    const articulos = await Articulo.find({creador: userId});

    const anuncios = await Anuncio.find({user: userId}).populate('articulo');

    res.render('perfil', {usuario, articulos, anuncios, userId});
}


exports.perfilCreado = async (req, res) => {
    let userId = req.session.passport.user.id;
    
    const usuario = await User.findById({_id: userId});

    const colecciones = await Coleccion.find({user: userId});

    const articulos = await Articulo.find({creador: userId});

    const anuncios = await Anuncio.find({user: userId}).populate('articulo');

    res.render('perfil-creado', {usuario, colecciones, articulos, anuncios, userId});
}

exports.perfilColeccionado = async (req, res) => {
    let userId = req.session.passport.user.id;
    const usuario = await User.findById({_id: userId});

    const misArticulos = await Articulo.find({propietarioId: userId}).populate('creador');

    const anuncios = await Anuncio.find({user: userId});

    res.render('perfil-coleccionado', {usuario, misArticulos, anuncios});
}

exports.mostrarAjustes = async (req, res) => {
    const id = req.params.id;

    const usuario = User.findOne({_id: id})

    res.render('perfil-ajustes', {usuario});
}


exports.enviarAjustes = async (req, res) => {
    const userId = req.session.passport.user.id;

    const { nombre, bio, email } = req.body;

    const result1 = await cloudinary.v2.uploader.upload(req.files['imagePerfil'][0].path);
    const result2 = await cloudinary.v2.uploader.upload(req.files['imageBanner'][0].path);

    if (nombre === '' , bio === '' , email === '') {
        const usuario = await User.updateOne(
            { _id: userId },
            {
                $set: {
                    imagePerfil: result1.url,
                    imageBanner: result2.url
                }
            });
    } else {
        const usuario = await User.updateOne(
            { _id: userId },
            {
                $set: {
                    nombre,
                    bio,
                    email,
                    imagePerfil: result1.url,
                    imageBanner: result2.url
                }
            });
    };


    await fs.unlink(req.files['imagePerfil'][0].path)
    await fs.unlink(req.files['imageBanner'][0].path)


    res.redirect('/perfil');
}

