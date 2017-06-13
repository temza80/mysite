/**
 * Created by yih on 13.1.17.
 */
var express = require('express');
var router = express.Router();
var nologin=require('../public/lib/checkAuth').nologin;
var checkAuth=require('../public/lib/checkAuth').user;
var checkAdmin=require('../public/lib/checkAuth').admin;
var checkAuthCom=require('../public/lib/checkAuth').comment;
var checkSizeCom=require('../public/lib/checkSize').comment;
var checkSizeRegister=require('../public/lib/checkSize').register;
var checkCaptcha=require('../public/lib/cap4a').captcha;
var lastComments=require('../public/lib/lastComments').comment;
var closeTags=require('../public/lib/other/closeTags').closeAndSpecs;
module.exports=function(app) {
//login

    app.get('/login', nologin, require('./login').getLogin);
    app.post('/login',checkCaptcha, require('./login').post);
    app.get('/register', nologin,require('./login').getRegister);
    app.post('/register',checkCaptcha, checkSizeRegister, require('./login').postRegister);
    app.get('/register/:secret', require('./login').emailValidate);
    app.get('/emailCheck', require('./login').emailCheck);
    app.get('/logout', require('./login').logOut);
    app.post('/resend_email/:email', require('./login').resendEmail);



    //blog
    app.get('/chat',checkAuth, require('./chat').get);
    app.get('/tags',checkAdmin, require('./admin').tags);
    app.get('/deltags/:tag',checkAdmin, require('./admin').delTags);
    app.get('/users',checkAdmin, require('./admin').users);
    app.get('/deluser/:type/:id',checkAdmin, require('./admin').delUser);
    app.post('/usercomments',checkAdmin, require('./admin').userComments);


    app.get('/posts/:page', require('./posts').get);
    app.get('/posts/tag/:tag', require('./posts').get);
    app.get('/posts/date/:date/:page', require('./posts').get);
    app.post('/posts/get_tags', require('./posts').getTags);
    app.post('/posts/get_links', require('./posts').calendar);
    app.post('/posts/get_likes', require('./posts').clickLike);

    app.get('/posts/date/:date', require('./posts').get);
    app.get('/post/:page', require('./post').get);
    app.get('/post/:page/:offset', require('./post').get);
    app.get('/postredcom/:page/:comment', require('./post').redactCom);
    app.get('/postredpost/:page', require('./post').redactPost);
    app.get('/posts', require('./posts').get);
   // app.post('/posts/',checkAdmin,require('./posts').post);
    app.get('/temp', require('./toBase').get);
    app.post('/postPost',checkAdmin,closeTags,require('./toBase').postPost);
    app.post('/postCom',checkCaptcha, checkAuth, checkSizeCom, closeTags,require('./toBase').postCom);
    app.get('/delpost/:page/:offset',checkAdmin, require('./toBase').delPost);
    app.get('/delcom/:page/:comment/:offset', checkAuthCom,require('./toBase').delCom);
    app.post('/redactPost/:page', checkAdmin, closeTags,require('./toBase').updatePost);
    app.post('/redactCom/:page',checkCaptcha,checkAuth, checkSizeCom, closeTags, require('./toBase').updateCom);
    app.post('/fulltext/:hrefa', require('./post').fulltext);
    app.post('/upl',checkAuth, require('./upl').post);

}
