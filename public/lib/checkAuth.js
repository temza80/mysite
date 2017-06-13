var Comment=require('./mongoose').CommentModel;
module.exports.user=function(req,res,next)
{

if(!req.user)return next(new Error('Not authorized'));
    next();
};
module.exports.admin=function(req,res,next)
{

    if(req.user.status!='a')return next(new Error('Not authorized'));
    next();
};
module.exports.comment=function(req,res,next)
{
Comment.findById(req.params.comment,function(err,comment) {
    if(err) return next(err);
    if (req.user._id != comment.author && req.user.status!='a')return next(new Error('Not authorized'));
    next();
})
};
module.exports.nologin=function(req,res,next)
{
    "use strict";
    if(req.user) res.redirect('/posts');
    else next();
}