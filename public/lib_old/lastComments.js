/**
 * Created by yih on 17.2.17.
 */
var Comment=require('./mongoose').CommentModel;
module.exports.comment=function(req,res,next)
{
    res.locals.lastComments=null;
    Comment.find({published:true},null,{sort: {modified: -1},limit:15},function(err,comments) {
        if(err) console.log(err.message);
       else res.locals.lastComments=comments;
        next();
    })
};