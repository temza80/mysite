var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var fileUpload = require('express-fileupload');
var cookieParser = require('cookie-parser');
var session = require('express-session');
   var mongoose    = require('mongoose');
   var socLogin= require('./public/lib/mongoose').socLoginModel;
var bodyParser = require('body-parser');
//var ArticleModel    = require('./public/lib/mongoose').ArticleModel;
//var testdb   = require('./public/lib/testdb').socLoginModel
var index = require('./routes/index');
var users = require('./routes/users');
//var TestDb =new testdb();
var app = express();
var async=require('async');
var config      = require('./public/lib/config');
var request = require('request');

app.engine('ejs',require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.get('session:secret')));
app.use(express.static(path.join(__dirname, 'public')));
var MongoStore=require('connect-mongo/es5')(session);

app.use(session({secret:config.get('session:secret'),resave: true, saveUninitialized: true, cookie:{expires:new Date().setYear(new Date().getFullYear()+1)},
    name:config.get('session:name'),
        store: new MongoStore({ mongooseConnection: mongoose.connection })}));
//cookie: {path: '/', httpOnly: false, secure: false, maxAge: 60000,expires:6000,domain:'http://localhost:3000/'
//app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(require('express-jquery')('/jquery.js'));
    app.use(function(req, res, next) {
    var hour = 5600000;
        //работая после роутов обнуляла сессию
//    req.session.cookie.expires = new Date(Date.now() + hour)
     //   req.session.cookie.maxAge = hour
    if(req.session.NumberOfVisits)req.session.NumberOfVisits=req.session.NumberOfVisits+1;
    else req.session.NumberOfVisits=1;



    next();
});

var passport = require('passport')
  , VKontakteStrategy = require('passport-vkontakte').Strategy;
app.use(passport.initialize());
    app.use(passport.session());
passport.use(new VKontakteStrategy(
  {
    clientID:     5915181, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: "IQkC9MQTfu7XLYVNWzqx",
    callbackURL:  "http://annamaka.in/auth/vkontakte/callback"
  },
  function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {

var verificationUrl = "https://api.vk.com/method/users.get?user_id="+profile.id+"&fields=photo_50&v=5.56"

    request(verificationUrl,function(error,response,body) {
      
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
       
   
    });


   socLogin.findOrCreate({ socid: profile.id },{type:"vk"},function (err,user) { console.log('i-'+user+'+'+err+profile.id); done(null, user); })
       
  }
));

// User session support for our hypothetical `user` objects.
passport.serializeUser(function(user, done) {
	
	
    done(null, user.doc._id);
});

passport.deserializeUser(function(id, done) {
;
   socLogin.findById(id)
        .then(function (user) { done(null, user); })
        .catch(done);
});
app.get('/auth/vkontakte', passport.authenticate('vkontakte'));

app.get('/auth/vkontakte/callback',
  passport.authenticate('vkontakte', {
    successRedirect: '/',
    failureRedirect: '/login' 
  })
);

app.use(function(req, res, next) {

    next();

});

app.use(fileUpload());
app.use( require('./public/lib/loadUser'));
app.use( require('./public/lib/lastComments').comment);
require('./routes/main')(app);
//require social seti
app.use('/', index);
app.use('/users', users);

//async.series([TestDb.putEx,TestDb.getExId],function(err,results){console.log("firt1"+results)});


var kaptcha = require('kaptcha');

app.get('/kaptcha.png', kaptcha({
    color: 'rgb(0, 0, 0)',
    background: 'rgb(255, 255, 255)',
    width: 200,
    height: 60
}))

app.use(function(req, res, next) {
    if(req.url=='/2') { res.render('index2', { title: 'GNAVPN' });
   }
    else next();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
res.send(err.message);
  // render the error page
 // res.status(err.status || 500);
 // res.render('error');
});

module.exports = app;
