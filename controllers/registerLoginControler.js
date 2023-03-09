const Carrito = require('../model/Carrito');
const User = require('../model/User');
const transporter = require('../config/mailer');
const jwt = require('jsonwebtoken');

exports.registrar = async (req, res) => {
    const {nombre, email, clave} = req.body;
	console.log('req.body', req.body);

	const usuario = new User({
		nombre, 
		email, 
		clave, 
		date: Date(),
		balance: 0,
		balanceDiferido: 0,
		articulos: []
	});

	usuario.save(err => {
		if (err) {
			const emailDuplicado = User.find({email: email});

			if (emailDuplicado) {
				res.status(500).render('emailDuplicado', {emailDuplicado, email});
			}

		} else {
			res.redirect('/login');
		}
	});

};

exports.registro = async (req, res) => {

    res.render('register');
};

exports.autenticar = async (req, res) => {
    const {email, clave} = req.body;

	let usuario = User.findOne({email}, (err, usuario) => {
		if (err) {
			res.status(500).send('ERROR AL AUTENTICAR EL USUARIO');
		} else if (!usuario) {
			res.status(500).send('EL USUARIO NO EXISTE');
		} else {
			User.findOne({clave, email}, (err, usuario) => {
				if (err) {
					res.status(500).send('ERROR AL AUTENTICAR');
				} else if (!usuario) {
					res.status(500).send('LA CLAVE NO COINCIDE');
				} else {
					req.login(usuario, function(err) {
						if(err){
							Error('Error al crear session');
							console.log('Error al crear session');
						}
						return res.redirect('/');
					})
				}
			});
		}
	});
};

exports.login = async (req, res) => {

    res.render('login')
};

exports.logout = async (req, res) => {
    req.logout(function(err) {
		if (err) { return next(err); }
		res.redirect('/login')
	});
	await Carrito.deleteMany();
};


exports.formularioEnviarEmailDeRecuperacion = async (req, res) => {


    res.render('enviarEmailRecuperacion');
};

exports.enviarEmailDeRecuperacion = async (req, res) => {
	const email = req.body.email;

	if (!email) {
		return res.status(400).json('El email es requerido');
	}

	const mensaje = 'Revisa tu email que se te envio un link para que cambies tu contraseña';
	let verificacionLink;
	let emailStatus = 'Ok';

	try {
		const user = await User.findOne({email: email});
	
		const payload = {
			sub: user._id
		}

		const token = jwt.sign({payload}, process.env.jwtSecret, {expiresIn: '10m'});

		verificacionLink = `http://localhost:3000/newPassword/${token}`;

		const resetToken = await User.updateOne(
            { _id: payload.sub },
            {
                $set: {
                    resetToken: token
                    }
            });

	} catch (error) {
		return res.render('emailNoRegistrado', {email});
	}

	// enviar email
	try {
		 // send mail with defined transport object
		await transporter.sendMail({
			from: '"Cambiar contraseña" <fajardobrisley@gmail.com>', // sender address
			to: email, // list of receivers
			subject: "Cambiar contraseña", // Subject line
			html: `
				<b>Por favor dar click en el link para completar el proceso. Ten en cuenta que tienes 10 minutos para utilizar el enlace antes de que expire.</b>
				<a href="${verificacionLink}">${verificacionLink}</a>
				`, // html body
		});
	} catch (error) {
		emailStatus = error;
		console.log(error);
		return res.status(400).json('No se pudo enviar el correo');
	}


	res.render('emailEnviado');
};


exports.formularioEnviarContraseña = async (req, res) => {
	const token = req.params.token;

    res.render('enviarNewPassword', {token});
};

exports.enviarNewPassword = async (req, res) => {
	const claveOne = req.body.claveOne;
	const claveTwo = req.body.claveTwo;
	const resetToken = req.params.token;

	console.log(claveOne, claveTwo);

	if (!claveOne && !claveTwo) {
		return res.status(400).json('Todos los campos son requeridos');
	} else if (claveOne != claveTwo) {
		return res.render('contraseñasNoCoinciden');
	}

	let jwtPayload; 

	try {
		jwtPayload = jwt.verify(resetToken, process.env.jwtSecret);

		const user = await User.findOne({resetToken: resetToken});

		const newPassword = await User.updateOne(
			{_id: user._id},
			{
				$set: {
					clave: claveOne
				}
			}
			)

	} catch (error) {
		return res.render('tokenVencido');
	}


    res.render('recuperacionExitosa');
};

