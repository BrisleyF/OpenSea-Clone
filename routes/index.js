const express = require('express');
const router = express.Router();
const inicioController = require('../controllers/inicioController');
const registerLoginController = require('../controllers/registerLoginControler');
const busquedaController = require('../controllers/busquedaController');
const coleccionesController = require('../controllers/coleccionController');
const perfilController = require('../controllers/perfilController');
const carritoController = require('../controllers/carritoController');
const walletContoller = require('../controllers/walletController');
const verificarUser = require('../middleware/verificarUser');
const venderController = require('../controllers/venderController');
const ofertarController = require('../controllers/ofertarController');
const subastaController = require('../controllers/subastaController');

module.exports = function() {

     // Inicio
    router.get('/', verificarUser, inicioController.inicio);

     // Login y registro
    router.post('/register', registerLoginController.registrar);

    router.get('/register', registerLoginController.registro);

    router.post('/autenticar', registerLoginController.autenticar);

    router.get('/login', registerLoginController.login);

    router.get('/logout', registerLoginController.logout);

    router.get('/enviarEmailRecuperacion', registerLoginController.enviarEmailDeRecuperacion)

     // Buscador 
    router.get('/buscar', busquedaController.busqueda);

     // Colecciones 
    router.post('/coleccion/add', coleccionesController.agregarColeccion);

    router.get('/crear/colecciones', coleccionesController.formularioCrearColeccion)
    
    router.get('/coleccion/:id', coleccionesController.mostrarColeccion);

    router.get('/detalle/:id', coleccionesController.detalleNFT);

    router.get('/mis/colecciones', coleccionesController.mostarMisColecciones);

    router.post('/agregar/articulo/:id', coleccionesController.agregarArticulo);

    router.get('/agregar/articulo/:id', coleccionesController.mostrarFormularioArticulo);

    router.get('/eliminar/articulo/:id', coleccionesController.eliminarArticulo)

    // Carrito 
    router.get('/carrito', carritoController.mostarCarrito)

    router.get('/carrito/agregar/:id', carritoController.agregarAlCarrito);

    router.get('/delete/:id', carritoController.eliminarArticulo)
    
    router.get('/delete', carritoController.eliminarTodo);

    router.post('/comprar', carritoController.comprar)

    // Perfil
    router.get('/perfil', perfilController.mostrarPerfil);

    router.get('/perfil/creado', perfilController.perfilCreado);

    router.get('/perfil/coleccionado', perfilController.perfilColeccionado);

    router.get('/perfil/ajustes/:id', perfilController.mostrarAjustes);

    router.post('/perfil/ajustes/:id', perfilController.enviarAjustes);

    // Wallet 
    router.get('/wallet', walletContoller.mostrarWallet);

    router.post('/depositar', walletContoller.depositarSaldo);

    // Vender 
    router.get('/vender/:id', venderController.mostarFormulario);

    router.post('/vender/:id', venderController.enviarAnuncio);

    // Ofertas 
    router.get('/ofertar/:id', ofertarController.mostrarFormulario);

    router.post('/ofertar/:id', ofertarController.enviarFormulario);

    // subasta 
    router.get('/subasta/:id', subastaController.subasta);

    router.get('/subasta/transferir/:id', subastaController.transferir);

    return router;
}