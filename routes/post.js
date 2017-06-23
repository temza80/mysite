/**
 * Created by yih on 24.1.17.
 */
/**
 * Created by yih on 19.1.17.
 */
var Posts = require('../public/lib/mongoose').PostModel;
var Comments = require('../public/lib/mongoose').CommentModel;
var Login = require('../public/lib/mongoose').LoginModel;
var async = require('async');
module.exports.get = function(req, res, next) {

    Posts.findById(req.params.page, function(err, page) {
        if (err) return next(err);

        var post_id = page._id.toString();
        req.session.beforeLogin = '/post/' + page._id;
        async.parallel([
            function(callback) {

                Comments.count({
                    post_id: post_id,
                    published: true
                }, callback)
            },
            function(callback) {
                if (req.params.offset) var offset = (req.params.page - 1) * 10;
                else var offset = 0;

                Comments.returnComments(post_id, offset, callback)

            },

        ], function(err, result) {
            /*var retarray=[];
             result[1][0].forEach(function(item, i, arr) {
             console.log( i + ": " + item.author);
             Login.findById(item.author,function(err,user){retarray[i]=user;
             if(i==arr.length-1) console.log(retarray);
             });
             });*/

            if (err) {
                console.log('findComments:' + err.message);

                if (page.published) res.render('post', {
                    page: page,
                    wysiwygAjax: '/postCom',
                    is_comments: 'none'
                });

            } else if (page.published) {
                res.render('post', {
                    page: page,
                    wysiwygAjax: '/postCom',
                    comments: result[1][0],
                    offset: result[1][1],
                    count: result[0],
                    is_comments: 'yes',
                    pagelink: '/post/' + page._id + '/'
                });
            }

        });




    });
}
module.exports.redactCom = function(req, res) {
    Posts.findById(req.params.page, function(err, page) {
        if (err) return next(err);

        var post_id = page._id.toString();
        async.parallel([
            function(callback) {

                Comments.count({}, callback)
            },
            function(callback) {

                Comments.returnComments(post_id, 0, callback)

            }
        ], function(err, result) {

            if (err) {
                console.log('findComments:' + err.message);

                if (page.published) res.render('post', {
                    page: page,
                    wysiwygAjax: '/postCom',
                    is_comments: 'none'
                });

            } else if (page.published) {
                res.render('post', {
                    page: page,
                    wysiwygAjax: '/redactCom/' + req.params.comment,
                    comments: result[1][0],
                    offset: result[1][1],
                    count: result[0],
                    is_comments: 'yes',
                    pagelink: '/post/' + page._id + '/'
                });
            }

        });


    });
}
module.exports.redactPost = function(req, res) {
    Posts.findById(req.params.page, function(err, page) {
        if (err) return next(err);

        var post_id = page._id.toString();
        async.parallel([
            function(callback) {

                Comments.count({}, callback)
            },
            function(callback) {

                Comments.returnComments(post_id, 0, callback)

            }
        ], function(err, result) {

            if (err) {
                console.log('findComments:' + err.message);

                if (page.published) res.render('post', {
                    page: page,
                    wysiwygAjax: '/postCom',
                    is_comments: 'none'
                });

            } else if (page.published) {
                res.render('post', {
                    page: page,
                    wysiwygAjax: '/redactPost/' + req.params.page,
                    comments: result[1][0],
                    offset: result[1][1],
                    count: result[0],
                    is_comments: 'yes',
                    pagelink: '/post/' + page._id + '/'
                });
            }

        });


    });
}
module.exports.fulltext = function(req, res, next) {


    Posts.findById(req.params.hrefa, function(err, page) {

        if (err) {
            res.send(err.message);

        }

        res.send(page.post);
    });
}
