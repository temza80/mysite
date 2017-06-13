/**
 * Created by yih on 20.1.17.
 */
var Post=require('../public/lib/mongoose').PostModel;
var Tag=require('../public/lib/mongoose').TagModel;
var Comment=require('../public/lib/mongoose').CommentModel;
var async=require('async');
var teasy = require('teasy');
module.exports.get=function(req,res) {
    res.render('temp');
};

//mime-tipy ssylka rn w br
module.exports.postPost=function(req,res,next) {





    var title = req.body.title;
    var post = req.body.posting;
    var inTags=JSON.parse(req.body.tags);


    Post.publish(title,post,inTags,function(err,post){
       if(err) return next(err);

       for(i=0;i<inTags.length;i++) Tag.updateTag(inTags[i],post,function(err){if(err) console.log('Error in tag:'+err+inTags[i])});
       res.sendStatus(200);
    });
 /*   async.series([function(callback){Post.publish(title,post,callback)},function(callback){Post.returnPosts(0,callback)}],function(err,results){
        if(err) return next(err);
        console.log('incallback');
        console.log("firt1"+results);
        res.sendStatus(200);
         });*/

};
module.exports.postCom=function(req,res,next) {


        Post.findById(req.body.post_id, function (err, page) {
            if (err) return next(err);
        });
        var title = req.body.title;
        var post = req.body.posting;
        var post_id = req.body.post_id.toString();

        Comment.publish(req.user.table+'_'+req.user._id,req.user.sign,post_id, title, post,
            function (err) {
                if (err) return next(err);
                res.sendStatus(200);
            });



};


module.exports.updateCom=function(req,res,next) {


        Comment.findById(req.params.page, function (err, page) {
            if (err) {
                console.log('loger' + err.message);
                return next(err);
            }

            var title = req.body.title;
            var post = req.body.posting;
            var post_id = req.body.post_id.toString();
            page.title = req.body.title;
            page.post = req.body.posting;
            page.modified = Date.now();

            page.save(function (err) {
                if (err) return next(err);

            });

            res.sendStatus(200);
        });


};
module.exports.updatePost=function(req,res,next) {


  Post.findById(req.params.page, function (err, page) {if(err) {  console.log('loger'+err.message); return next(err);}

        var title = req.body.title;
        var post = req.body.posting;
        var post_id=req.body.post_id.toString();
        page.title= req.body.title;
        page.post=req.body.posting;
        page.teaser=teasy(req.body.posting);
        page.modified=Date.now();
        inTags=page.tags=JSON.parse(req.body.tags);
        page.save(function(err){if(err) console.log(err);
            for(i=0;i<inTags.length;i++) Tag.updateTag(inTags[i],post._id,function(err){if(err) console.log('Error in tag:'+err+inTags[i])});



        });

        res.sendStatus(200);
    });

};

module.exports.delPost=function(req,res,next) {
    Post.findById(req.params.page, function (err, page) {if(err) {  console.log('loger'+err.message); return next(err);}


       page.published=false;
        page.save(function(err){if(err) return next(err);});
        
        Comment.find({post_id:req.params.page},function(err,comments)
        {
			if(err) console.log(err);
			else{
comments.forEach(function(comment, i, comments) {
comment.published=false;
comment.save(function(err){if(err) console.log(err);});
});
}
});
        
        var skip = req.params.offset!=0 ? '/'+req.params.offset : '';
        res.redirect('/posts/'+skip);//на ту же страницу потом- просто передать и просчитать офсет
    });

}
module.exports.delCom=function(req,res,next) {
    Comment.findById(req.params.comment, function (err, comment) {if(err) {  console.log('loger'+err.message); return next(err);}


        comment.published=false;
       comment.save(function(err){if(err) return next(err);});

var skip = req.params.offset!=0 ? '/'+req.params.offset : '';
        res.redirect('/post/'+req.params.page+skip);//на ту же страницу потом
    });

}
module.exports.delCom=function(req,res,next) {
    Comment.findById(req.params.comment, function (err, comment) {if(err) {  console.log('loger'+err.message); return next(err);}


        comment.published=false;
       comment.save(function(err){if(err) return next(err);});

var skip = req.params.offset!=0 ? '/'+req.params.offset : '';
        res.redirect('/post/'+req.params.page+skip);//на ту же страницу потом
    });

}
