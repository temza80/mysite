var User=require('./mongoose').LoginModel;
var request = require('request');
module.exports=function(req,res,next){
	  req.unemail=res.locals.unemail = null;
    if(typeof req.user!='undefined')
    {
		req.user.status='c';
		if(req.user.type=='vk')
		{
			var verificationUrl = "https://api.vk.com/method/users.get?user_id="+req.user.socid+"&fields=photo_50&v=5.56"

    request(verificationUrl,function(error,response,body) {
      if(error)next();
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
       
  req.user.sign='<img src="../technical_images/vkontakte-120x120.png" width:33% height:33%>'+body.response[0].first_name+' '+body.response[0].last_name;//фото имя фамилия usersign
   req.user.table='socNet';//таблица id - для будущих возможных сообщений.
  res.locals.user=req.user;
  next();
    });

		}
		
		
	}
	else//собственная идентификацмя
	{
    req.user=res.locals.user=null;
  

    if(!req.session.user_id) return next();
    User.findById(req.session.user_id,function(err,user){
if(err) return next(err);
if(user!=null && (user.status=='a' || user.status=='b'|| user.status=='c')) {
	user.sign=user.username;
	user.table='local';//для будущих возожных личных  сообщений
    req.user = res.locals.user = user;


}
else if(user!=null) req.unemail=res.locals.unemail = user.email;
next();
    });
    }
};
