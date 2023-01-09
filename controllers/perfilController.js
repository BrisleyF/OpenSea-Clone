
exports.mostrarPerfil = async (req, res) => {
    res.render('perfil');
}

exports.perfilCreado = async (req, res) => {
    res.render('perfil-creado');
}

exports.perfilColeccionado = async (req, res) => {
    res.render('perfil-coleccionado');
}

exports.perfilDestacado = async (req, res) => {
    res.render('perfil-destacado');
}

exports.perfilActividad = async (req, res) => {
    res.render('perfil-actividad');
}

exports.perfilAjustes = async (req, res) => {
    res.render('perfil-ajustes');
}