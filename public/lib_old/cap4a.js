/**
 * Created by yih on 17.2.17.
 */
var request = require('request');
module.exports.captcha=function(req,res,next)
{

if( req.user!=null && req.user.status=='a') next();

    else if (req.session.captcha != req.body.captcha)
    {
        res.status(200).send('Неверный код картинки')
    }
    else   next();
};

module.exports.r_captcha=function(req,res,next)
{
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + "6LcsaBYUAAAAAGo6PsGxexYKrbxj1eQBNSwR7wYj" + "&response=" + req.body.captcha + "&remoteip=" + req.connection.remoteAddress;

    request(verificationUrl,function(error,response,body) {
        console.log(body);
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        console.log(body);
      if(body.success !== undefined && !body.success) {
            res.status(200).send('Неверный код картинки')
        }
      else next();
    });


};
