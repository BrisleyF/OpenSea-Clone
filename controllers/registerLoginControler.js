

exports.registrar = async (req, res) => {
    res.send('Registrado');
};

exports.registro = async (req, res) => {
    res.render('register');
};

exports.autenticar = async (req, res) => {

}

exports.login = async (req, res) => {
    res.render('login')
};

exports.logout = async (req, res) => {
    res.send('Session cerrada')
};