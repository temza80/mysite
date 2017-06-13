var User=require('./mongoose').LoginModel;
module.exports=function(req,res,next){
	console.log(req.user);
    req.user=res.locals.user=null;
    req.unemail=res.locals.unemail = null;

    if(!req.session.user_id) return next();
    User.findById(req.session.user_id,function(err,user){
if(err) return next(err);
if(user!=null && (user.status=='a' || user.status=='b'|| user.status=='c')) {
    req.user = res.locals.user = user;


}
else if(user!=null) req.unemail=res.locals.unemail = user.email;
next();
    });
};
