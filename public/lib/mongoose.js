var mongoose    = require('mongoose');
var async=require('async');
var config      = require('./config');
var mail     = require('./mailer').mail;
var crypto=require('crypto');
var closeTags=require('./other/closeTags').closeTags;
mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error!:'+ err.message+config.get('port'));
});
db.once('open', function callback () {
    console.log("Connected to DB!");
});

var Schema = mongoose.Schema;

// Schemas

//login
var socLogin = new Schema({

    socid: { type: String, required: true},
    type:{type: String, required: true },
    username:{type:String,required:false},



    modified: { type: Date, default: Date.now }
});
socLogin.statics.findOrCreate = require("find-or-create");
var Login = new Schema({

    username: { type: String, required: true },
    hashedPassword:{type: String, required: true },
    salt:{type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, required: true },


    modified: { type: Date, default: Date.now }
});



Login.methods.encryptPassword=function(password) {

    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');

};
Login.virtual('password').set(function(password){
    this._plainPassword=password;
    this.salt=Math.random();
    this.hashedPassword=this.encryptPassword(password);
}).get(function(){return this._plainPassword});
Login.methods.checkPassword=function(password){
    return this.encryptPassword(password)===this.hashedPassword;
};

Login.statics.authorise=function(login,password,callback)
{
    var User=this;

    async.waterfall([
        function(callback){
            User.findOne({username: login},callback);
        },
        function(user,  callback){
            if (user) {
                if (user.checkPassword(password)) {
                    callback(null,user);
                } else { callback(new Error('Wrong password!!!'))
                }
            }
            else {
                callback(new Error('Пользователя с таким именем нет в базе!'));
            }
        },

    ],callback);

};

Login.statics.register=function(login,password,email,secret,callback)
{
    var User=this;

    async.waterfall([
        function(callback){
            User.findOne({email: email},callback);

        },
        function(email,callback){
            if (email) {
                console.log('Email already exist!!!');


                callback(new Error('Email already existing!!!'))
            }
            else {
                User.findOne({username: login}, callback);
            }
        },
        function(user,  callback){
            if (user) {


                 callback(new Error('Username already exist!!!'))
                }

            else {
                var user = new User({username: login, password: password,email:email,status:secret});
                user.save(function (err) {
                    if (err){ console.log(err.message);return callback(err);}
                   else{mail(email,secret);}//еще email+-email in login+возврат ошибок в аякс

                    });

                    callback(null, 'ok',user);
                }
            },


    ],callback);

};

//post

var Likes = new Schema({

   user_id: { type: String, required: true },
    post_id:{type: String, required: true }
});
Likes.statics.click=function(post_id_,user_id_,callback)
{
	console.log(user_id_);
    var Likes=this;

    async.waterfall([//user_id не передается
        function(callback){
            Likes.findOne({user_id: user_id_,post_id:post_id_},callback);
        },
        function(like,  callback){
            if (like) {
Likes.remove({user_id: user_id_,post_id:post_id_},callback);
}
else
{
 var like = new Likes({post_id: post_id_, user_id: user_id_});
                like.save(function (err) {

callback(err,'saved')
})
}
},
   function(result,  callback){

Likes.count({post_id:post_id_},callback)
}            

    ],callback);

};
var Post = new Schema({

   title: { type: String, required: true },
    teaser:{type: String, required: true },
    post:{type: String, required: true },
    published:{type: Boolean, default: true },
    modified: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    tags:[{type:String,default:''}],

    hundred: { type: Number, default: 1 }
});
Post.statics.publish=function(title,post, inTags,callback) {
    var teasy = require('teasy');


    var Post = this;
   // var teaserSize=(post.length > 250) ? 250 : post.lentgh;//title na kliente obrabotac

    var post = new Post({title: title,teaser:closeTags(teasy(post),/<(i|\/i|s|\/s|b|\/b)>/gi), post: post,tags:inTags});
    post.save(function (err,post) {
        if (err) return callback(err);
        callback(null,post);
});
}

Post.statics.returnPosts=function(offset,params,callback){
    var Posts=this;
  ///  var ldate=(date)? date:{"$gte": new Date(1901, 1, 1)};

console.log(params);
    Posts.find(params,null,{sort: {modified: -1},limit:10,skip:offset},function(err,data){
        if(err) return callback(err);
        callback(null,data,offset);

    })
}

Post.statics.returnAjaxPosts=function(date,callback){
    var Posts=this;
    var ldate=(date)? date:{"$gte": new Date(1901, 1, 1)};


    Posts.find({published:true,modified:ldate},null,function(err,data){
        if(err) return callback(err);
        callback(null,data);

    })
}


//comment
var Comment = new Schema({
    author:{type: String, required: false },
    author_name:{type: String, required: false },
author_params: [{
    id: String,
    sign: String,
    plain_name:String
  }],
    post_id: { type: String, required: true },
    title:{type: String, required: true },
    post:{type: String, required: true },
    published:{type: Boolean, default: true },
    modified: { type: Date, default: Date.now }
});
Comment.statics.publish=function(author_id,author_name,post_id,title,post,callback) {
    var teasy = require('teasy');


    var Comment = this;
    // var teaserSize=(post.length > 250) ? 250 : post.lentgh;//title na kliente obrabotac

    var comment = new Comment({author:author_id,author_name:author_name,post_id:post_id,title: teasy(title), post: teasy(post)});
    comment.save(function (err) {
        if (err) return callback(err);
        callback(null);
    });
};
Comment.statics.returnComments=function(post_id,offset,callback){
    var Comments=this;


    Comments.find({post_id:post_id,published:true},null,{sort: {modified: 1},limit:10,skip:offset},function(err,data){
        if(!err) err=null;
        callback(err,data,offset);
        //console.log(data)
    })
}
//tag
var Tag= new Schema({
    tag:{type: String, required: true },
    posts:[String],
    weight:{type:Number}

});
Tag.statics.updateTag=function(intag,post,callback) {
    var Tag=this;

    Tag.findOne({tag:intag}, 
        function(err,tags){
        if(err){ console.log(err); return;}
if (tags==null) {
     var tag= new Tag({tag:intag});
     tag.posts.push("<a href='post/"+post._id+"'>"+post.title+"</a>");
     tag.weight=1;
     tag.save(function(err){ if(err) return callback(err); });
     callback(null);
 }
     else 
     {
        tags.posts.push("<a href='post/"+post._id+"'>"+post.title+"</a>");
        tags.weight++;
         tags.save(function(err){ if(err) return callback(err); });
         callback(null);


     }
    })


        
 
}


var LoginModel = mongoose.model('Login', Login);
var PostModel = mongoose.model('Post', Post);
var CommentModel = mongoose.model('Comment', Comment);
var socLoginModel = mongoose.model('socLogin', socLogin);
var LikesModel = mongoose.model('Likes', Likes);
var TagModel = mongoose.model('Tag', Tag);

module.exports.LoginModel = LoginModel
module.exports.CommentModel = CommentModel;
module.exports.PostModel = PostModel;
module.exports.socLoginModel = socLoginModel;
module.exports.LikesModel = LikesModel;
module.exports.TagModel = TagModel;

