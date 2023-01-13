const User = require('../model/User');

exports.mostrarPerfil = async (req, res) => {
    let userId = req.session.passport.user.id;
    const usuario = await User.findById({_id: userId});

    res.render('perfil', {usuario});
}

exports.perfilCreado = async (req, res) => {
    let userId = req.session.passport.user.id;
    const usuario = await User.findById({_id: userId});

    res.render('perfil-creado', {usuario});
}

exports.perfilColeccionado = async (req, res) => {
    let userId = req.session.passport.user.id;
    const usuario = await User.findById({_id: userId});

    res.render('perfil-coleccionado', {usuario});
}

exports.perfilDestacado = async (req, res) => {
    let userId = req.session.passport.user.id;
    const usuario = await User.findById({_id: userId});

    res.render('perfil-destacado', {usuario});
}

exports.perfilActividad = async (req, res) => {
    let userId = req.session.passport.user.id;
    const usuario = await User.findById({_id: userId});

    res.render('perfil-actividad', {usuario});
}

exports.perfilAjustes = async (req, res) => {
    res.render('perfil-ajustes');
}