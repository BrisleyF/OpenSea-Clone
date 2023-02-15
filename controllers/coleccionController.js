const Coleccion = require('../model/Coleccion');
const User = require('../model/User');
const Articulo = require('../model/Articulo');
const Anuncio = require('../model/Anuncio');
const Oferta = require('../model/Oferta');
const Carrito = require('../model/Carrito');
const cloudinary  = require('cloudinary');
const fs = require('fs-extra');
const moment = require("moment");

moment.locale('es');

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

    const { nombre, descripcion, categoria, comision } = req.body;

    const result1 = await cloudinary.v2.uploader.upload(req.files['imageLogoUrl'][0].path);
    const result2 = await cloudinary.v2.uploader.upload(req.files['imageBannerUrl'][0].path);


    const userId = req.session.passport.user.id;

    const coleccion = new Coleccion({
        imageLogoUrl: result1.url,
        imageBannerUrl: result2.url,
        nombre,
        descripcion,
        categoria,
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

exports.formularioCrearColeccion = async (req, res) => {

    res.render('crear-colecciones');
}

exports.mostrarColeccion = async (req, res) => {
    let id = req.params.id;

    const userId = req.session.passport.user.id;

    const coleccion = await Coleccion.findOne({ _id: id }).populate('user');

    const articulos = await Articulo.find({coleccion: id}).populate('anuncio');

    res.render('coleccion', { coleccion, userId, articulos});
}

exports.detalleNFT = async (req, res) => {
    const id = req.params.id;
    
    const userId = req.session.passport.user.id;

    const hoy = Date.now();
    
    const articulo = await Articulo.findOne({_id: id}).populate('creador').populate('coleccion');

    const anuncio = await Anuncio.findOne({articulo: id}).populate('articulo').populate('coleccion');

    const ofertas = await Oferta.find({articulo: id}).sort({precio: -1});

    const artCarrito = await Carrito.findOne({idArticulo: id });

    /*const vencimiento = anuncio.vencimientoNow;
    console.log("hoyUsuario: ",hoy);
    console.log(vencimiento);
    console.log(hoy < vencimiento);*/

    res.render('detalle', {articulo, anuncio, ofertas, userId, hoy, artCarrito});
}

exports.mostarMisColecciones = async (req, res) => {
    const userId = req.session.passport.user.id;

    const colecciones = await Coleccion.find({user: userId});

    res.render('mis-colecciones', {colecciones});
}

exports.mostrarFormularioArticulo = async (req, res) => {
    const id = req.params.id;

    const coleccion = await Coleccion.findOne({_id: id});

    res.render('agregar-articulo', {coleccion});
}

exports.agregarArticulo = async (req, res) => {
    const id = req.params.id;

    const userId = req.session.passport.user.id;
    const userName = req.session.passport.user.nombre;

    const coleccion = await Coleccion.findOne({_id: id});

    const { nombre, descripcion } = req.body;

    const result = await cloudinary.v2.uploader.upload(req.files['imageArticulo'][0].path);

    let formato = 'L'

    const articulo = new Articulo({
        nombre,
        descripcion,
        imageArticulo: result.url,
        creador: userId,
        coleccion: id,
        propietario: userName,
        propietarioId: userId,
        anunciado: false,
        actividad: [  
            {   
                evento: 'Agregado',    
                imageArticulo: result.url,
                nombre,
                coleccion: coleccion.nombre,
                emisor: 'N/A',
                receptor: userName,
                date: moment().format(formato)
            }
        ],
        date: moment().format(formato)
    })

    await articulo.save();

    await fs.unlink(req.files['imageArticulo'][0].path)
    

    res.redirect(`/coleccion/${id}`);
}

exports.eliminarArticulo = async (req, res) => {
    const id = req.params.id;

    const art = await Articulo.findOne({_id: id}); 

    const coleccion = await Coleccion.findOne({});

    await Articulo.findByIdAndDelete({ _id: id });

    await Anuncio.findByIdAndDelete({articulo: id})

    await Oferta.deleteMany({articulo: id});

    res.redirect(`/coleccion/${art.coleccion}`);
}