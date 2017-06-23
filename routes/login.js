var User = require('../public/lib/mongoose').LoginModel;
var async = require('async');
var mail = require('../public/lib/mailer').mail;
module.exports.getLogin = function(req, res) {
    var redirect = (typeof req.session.beforeLogin != 'undefined') ? req.session.beforeLogin : '/posts';

    res.render('login', {
        target: 'login',
        formTitle: "Панель входа",
        scriptUrl: '/login',
        winHref: redirect
    });
};
module.exports.getRegister = function(req, res) {
    res.render('login', {
        target: 'register',
        formTitle: "Регистрация",
        scriptUrl: '/register',
        winHref: '/emailCheck'
    });
};
module.exports.logOut = function(req, res, next) {
    var redirect = (typeof req.session.beforeLogin != 'undefined') ? req.session.beforeLogin : '/posts';
    req.session.destroy();
    res.redirect(redirect);
}
module.exports.post = function(req, res, next) {

    var login = req.body.username;
    var password = req.body.password;

    // next();
    User.authorise(login, password, function(err, user) {
        if (err) {
            console.log(err);
            res.status(200).send(err.message);
        } else {
            req.session.user_id = user._id;

            res.status(200).send('ok');
        }
    });

};
module.exports.postRegister = function(req, res, next) {

    var randomstring = require("randomstring").generate();
    User.findOne({
        status: randomstring
    }, function(err, string) {
        if (err) return next(err);

        if (string) postRegister(req, res);
        else {


            var login = req.body.username;
            var password = req.body.password;
            var email = req.body.email;

            User.register(login, password, email, randomstring, function(err, status, user) {

                if (err) {
                    console.log(err.message);
                    res.status(200).send(err.message);
                } else {

                    req.session.user_id = user._id;
                    req.session.email = user.email;
                    res.status(200).send('ok');
                }
            })


        }
    })




};

module.exports.emailValidate = function(req, res) {

    //  res.send(req.params.secret);
    User.findOne({
        status: req.params.secret
    }, function(err, user) {
        if (err) return next(new Error('Ошибка валидации, возможно, адрес уже подтвержден'));
        user.status = 'c';
        user.save(function(err) {
            if (err) return next(err);
        })
        var redirect = (typeof req.session.beforeLogin != 'undefined') ? req.session.beforeLogin : '/posts';
        res.redirect(redirect);


    })
    //  res.render('login',{message:'Проверка секретного кода ',scriptUrl:'/emailCheck',winHref:'/posts'});//выслать страницу с мессиджем и аяксом проверкой-редиректом
};
module.exports.emailCheck = function(req, res) {
    res.render('login', {
        message: 'На Ваш адрес ' + req.session.email + ' выслана ссылка'
    }); //выслать страницу с мессиджем и аяксом проверкой-редиректом
};
module.exports.resendEmail = function(req, res) {
    var email = req.params.email;
    User.findOne({
        email: email
    }, function(err, user) {
        if (err) return next(err);
        mail(email, user.status);
        res.status(200).send('Письмо отправлено. Проверьте ящик.');
    });
    // res.render('login',{message:'На Ваш адрес '+req.session.email+' выслана ссылка'});//выслать страницу с мессиджем и аяксом проверкой-редиректом
};
