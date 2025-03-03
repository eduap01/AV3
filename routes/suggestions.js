const express=require('express');
const router=express.Router();
const nodemailer = require('nodemailer');
const User=require('../models/user');

//cacharro de los mails
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth:{
    user: 'cuenta.aula.datos@gmail.com',
    pass: 'tyxx wecf pgyx maes'
  }
});

// Renderizar la vista de sugerencias
router.get('/suggestions', (req, res) => {
    res.render('suggestions'); // Asegúrate de tener un archivo "suggestions.ejs" en la carpeta "views"
});


// Ruta para recibir y enviar las sugerencias por correo
router.post('/send-suggestion', isAuthenticated, async (req, res) => {
    const { message, studentEmail } = req.body;

    try {
        // Obtener los correos de los administradores
        const admins = await User.find({ rol: 'administrador' });
        const adminEmails = admins.map(admin => admin.email);

        if (adminEmails.length === 0) {
            return res.status(400).send("No hay administradores registrados para recibir sugerencias.");
        }

        // Configurar el correo a enviar
        const mailOptions = {
            from: 'cuenta.aula.datos@gmail.com', // Correo del estudiante que envía la sugerencia
            to: adminEmails.join(','), // Enviar a todos los administradores
            subject: 'Nueva sugerencia de un estudiante',
            text: `Mensaje: ${message} `
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

         req.flash('successMessage', '✅ Sugerencia enviada correctamente.');
         res.redirect('/suggestions');


    } catch (error) {
        console.error("Error al enviar el correo:", error);
        res.status(500).send("Error al enviar la sugerencia.");
    }
});

function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}

module.exports = router;