const express = require('express');
const router = express.Router();
const inicioController = require('../controllers/inicioController');
const registerLoginController = require('../controllers/registerLoginControler');
const busquedaController = require('../controllers/busquedaController');
const coleccionesController = require('../controllers/coleccionController');
const perfilController = require('../controllers/perfilController');

module.exports = function() {

     // Inicio
    router.get('/', inicioController.inicio);

     // Login y registro
    router.post('/register', registerLoginController.registrar);

    router.get('/register', registerLoginController.registro);

    router.post('/autenticar', registerLoginController.autenticar);

    router.get('/login', registerLoginController.login);

    router.get('/logout', registerLoginController.logout);

     // Buscador 
    router.get('/buscar', busquedaController.busqueda);

     // Colecciones 
    router.post('/coleccion/add', coleccionesController.agregarColeccion);
    
    router.get('/coleccion/:id', coleccionesController.mostrarColeccion);

    router.get('/detalle/:id', coleccionesController.detalleNFT);

    router.get('/mis/colecciones', coleccionesController.mostarMisColecciones);

    router.post('/agregar/articulo/:id', coleccionesController.agregarArticulo);

    router.get('/agregar/articulo/:id', coleccionesController.mostrarFormularioArticulo);

    router.get('/carrito/agregar/:id', coleccionesController.agregarAlCarrito);

    // Perfil
    router.get('/perfil', perfilController.mostrarPerfil);

    router.get('/perfil/creado', perfilController.perfilCreado);

    router.get('/perfil/coleccionado', perfilController.perfilColeccionado);

    router.get('/perfil/destacado', perfilController.perfilDestacado);

    router.get('/perfil/actividad', perfilController.perfilActividad);

    router.get('/perfil/ajustes/:id', perfilController.mostrarAjustes);

    router.post('/perfil/ajustes/:id', perfilController.enviarAjustes);


    return router;
}