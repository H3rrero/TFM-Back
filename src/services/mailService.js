var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alejandro.fernandezherrero.bca@gmail.com',
    pass: '19Omedines94!'
  }
});

exports.sendMail = function (mail,pass) {
    console.log(mail);
    console.log(pass)
    var mailOptions = {
        from: 'alejandro.fernandezherrero.bca@gmail.com',
        to: mail,
        subject: 'Se te ha asignado una nueva contraseña',
        text: 'Tu nueva contraseña es '+pass
      };

	transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

};