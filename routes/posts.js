/**
 * Created by yih on 19.1.17.
 */
var Posts=require('../public/lib/mongoose').PostModel;
var Tags=require('../public/lib/mongoose').TagModel;
var Likes=require('../public/lib/mongoose').LikesModel;
var async=require('async');
module.exports.clickLike=function(req,res,next) {
	if(req.user!=null)
	{
	var user_id=req.user.table+'_'+req.user.id;
	
Likes.click(req.body.post_id,user_id,function(err,count){
	if(err) console.log(err)
	console.log('likes'+count);
Posts.findById(req.body.post_id,function(err,post){if(err) console.log(err); else{ post.likes=count;post.save(function (err) {
                if (err) console.log(err)});
}})

res.send({'count':count})})
}
}
module.exports.get=function(req,res,next) {
    if (req.params.page) offset=(req.params.page-1)*10;
    else offset=0;
    var dateRange=(typeof req.params.date!='undefined')? req.params.date.split('-'):null;
  
    if(dateRange!=null) {
        var date = {
            "$gte": new Date(dateRange[0], dateRange[1], dateRange[2]),
            "$lt": new Date(dateRange[0], dateRange[1], parseInt(dateRange[2]) + 1)

        }
    }
    console.log(date)
    var params=
    {
        published:true
    };
    if(dateRange!=null) params.modified=date;
    if(typeof req.params.tag!='undefined') params.tags=req.params.tag;  //{$all : ["sushi", "bananas"] } 


    async.parallel([
        function(callback){

            //if(dateRange!=null) {

                Posts.count(params,callback)
            //}

            //else Posts.count({published:true},callback)
             },
        function(callback){
            console.log(offset);

            Posts.returnPosts(offset,params,callback)

             }
    ], function (err, result) {

        if(err) return next(err);
        res.render('posts',{data:result[1][0],offset:result[1][1],count:result[0]-1,wysiwygAjax:'/postPost',pagelink:'/posts/'});
        // Сейчас результат будет равен 'Готово'
    });


};
module.exports.post=function(req,res,next) {
/*
    var login = req.body.login;
    var password = req.body.password;

    // next();
    User.authorise(login, password, function (err, user) {
        if(err){ console.log(err); return next(err);}

        req.session.usern=user._id;
        console.log("hi-"+req.session.usern);
        res.sendStatus(200);
    });*/
};

module.exports.getTags=function(req,res,next) {
Tags.find({},function(err,tags){if(err) console.log(err); res.send(tags);})
    }
module.exports.calendar=function(req,res,next) {
    var dateRange = {
        "$gte": new Date(req.body.year, req.body.month, 1),
        "$lte": new Date(req.body.year, req.body.month, req.body.last)

    }



    Posts.returnAjaxPosts(dateRange,function(err,data,offset)
        {


            var  retArr=[];
            console.log(err);
            data.forEach(function(item, i, arr) {
                retArr.push(item.modified.getDate());
            });
            //console.log(retArr)
res.send(retArr);

        }

    )
}
