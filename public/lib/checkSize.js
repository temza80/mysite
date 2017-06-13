/**
 * Created by yih on 15.2.17.
 */
module.exports.comment=function(req,res,next)
{

    if(req.body.title.length>150) return next(new Error('Длина заголовка превысила норму 150 знаков'));
    if(req.body.posting.length>1500) return next(new Error('Длина комментария превысила норму 1500 знаков'));
    next();
};
module.exports.register=function(req,res,next)
{

    if(req.body.username.length>15)  res.status(200).send(JSON.stringify({'message':'Длина логина превысила 15 знаков'}));
    else if(req.body.password.length>15)  res.status(200).send(JSON.stringify({'message':'Длина пароля превысила 15 знаков'}))
    else if(req.body.email.lenght>50)  res.status(200).send(JSON.stringify({'message':'Длина электронной почты превысила 50 знаков'}))
  else  next();
};

