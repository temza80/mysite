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


var app = express();
var async=require('async');
var config      = require('./public/lib/config');


app.engine('ejs',require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



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

app.use(require('express-jquery')('/jquery.js'));
    app.use(function(req, res, next) {
    var hour = 5600000;
 
    if(req.session.NumberOfVisits)req.session.NumberOfVisits=req.session.NumberOfVisits+1;
    else req.session.NumberOfVisits=1;



    next();
});
require('./public/lib/socialPassport.js')(app);

/*app.use(function(req, res, next) {

    next();

});
*/
app.use(fileUpload());
app.use( require('./public/lib/loadUser'));
app.use( require('./public/lib/lastComments').comment);
app.use(function(req, res, next) {
var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
console.log('hm-'+ip); var hour=new Date().getHours();
    console.log(hour+'_'+req.url); next();
});

require('./routes/main')(app);

app.use('/', index);




/*var kaptcha = require('kaptcha');

app.get('/kaptcha.png', kaptcha({
    color: 'rgb(0, 0, 0)',
    background: 'rgb(255, 255, 255)',
    width: 200,
    height: 60
}))
*/


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
