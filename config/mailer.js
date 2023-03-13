const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.email, // generated ethereal user
      pass: process.env.adminApi // generated ethereal password
    },
});


transporter.verify().then(() => {
    console.log('Listo para enviar el email');
})

module.exports = transporter;