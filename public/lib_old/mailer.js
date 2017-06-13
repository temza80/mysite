/**
 * Created by yih on 7.2.17.
 */

//'use strict';

module.exports.mail=function(emailTo,secretString) {
    var nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
   var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'temza80',
            pass: '111klopkl'
        }
    });

// setup email data with unicode symbols
    var mailOptions = {
        from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
        to: emailTo, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: secretString, // plain text body
        html: '<b>Перейдите по ссылке для подтверждения почтового адреса <a href="localhost:3000/register/'+secretString +' ">localhost:3000/register/'+secretString+'.</a> </b>' // html body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}