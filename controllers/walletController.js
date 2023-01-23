const User = require("../model/User");
const Articulo = require('../model/Articulo');

exports.mostrarWallet = async (req, res) => {
    const userId = req.session.passport.user.id;

    const usuario = await User.findOne({_id: userId});

    const articulos = await Articulo.find({propietarioId: userId}).populate('creador');

    res.render('wallet', {usuario, articulos});
}

exports.depositarSaldo = async (req, res) => {
    const userId = req.session.passport.user.id;
    const {monto} = req.body;

    const user = await User.findOne({_id: userId});

    const sumar = parseInt(user.wallet.balance) + parseInt(monto);


    const usuario = await User.updateOne(
        { _id: userId },
        {
            $set: {
                wallet: {
                    balance: sumar,
                    articulos: []
                }
            }
        });

    res.redirect('/wallet');
}