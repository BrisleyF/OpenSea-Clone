const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'fajardobrisley@gmail.com', // generated ethereal user
      pass: 'yidsuoiqzzasybyk' // generated ethereal password
    },
});

transporter.verify().then(() => {
    console.log('Listo para enviar el email');
})

module.exports = transporter;