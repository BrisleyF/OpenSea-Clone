const User = require("../model/User");
const Articulo = require('../model/Articulo');
const Anuncio = require('../model/Anuncio');

exports.mostrarWallet = async (req, res) => {
    const userId = req.session.passport.user.id;

    const usuario = await User.findOne({_id: userId});

    const articulos = await Articulo.find({propietarioId: userId}).populate('creador');

    //const anuncios = await Anuncio.find({user: userId});

    res.render('wallet', {usuario, articulos});
}

exports.depositarSaldo = async (req, res) => {
    const userId = req.session.passport.user.id;
    const {monto} = req.body;

    const user = await User.findOne({_id: userId});

    const sumar = parseInt(user.balance) + parseInt(monto);


    const usuario = await User.updateOne(
        { _id: userId },
        {
            $set: {
                balance: sumar
            }
        });

    res.redirect('/wallet');
}