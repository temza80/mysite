var Tags = require('../public/lib/mongoose').TagModel;
var Users = require('../public/lib/mongoose').LoginModel;
var Comments = require('../public/lib/mongoose').CommentModel;
var Posts = require('../public/lib/mongoose').PostModel;

function remove_a(author_name) {
    var reg = /<a href.*>(.*)<\/a>/;

    var ret = author_name.match(reg);

    if (ret) return ret[1];
    else return author_name;
}
module.exports.tags = function(req, res, next) {
    Tags.find({}, function(err, tags) {
        if (err) console.log(err);
        res.render('tags', {
            tags: tags
        });
    })
}
module.exports.users = function(req, res, next) {
    Users.find({}, function(err, users) {
        if (err) console.log(err);
        /*
        	users.forEach(function(item,i,arr) {
        		Comments.find({author:item._id},function(err,comments){if(err) console.log(err);
        users[i].comments=comments;
        if(i==arr.length-1) res.render('users',{users:users});

        })


        		
        });*/


        res.render('users', {
            users: users
        });
    })
}
module.exports.delUser = function(req, res, next) {
    console.log('lah-' + req.params.type);
    if (req.params.type == 'all') {
        Comments.remove({
            author: 'local_' + req.params.id
        }, function(err) {
            if (err) console.log(err)
        });

    } else if (req.params.type == 'savecom') {
        Comments.find({
                author: 'local_' + req.params.id
            }).cursor()
            .on('data', function(e) {

                if (typeof e.author_name != 'undefined') e.author_name = remove_a(e.author_name);

                e.save(function(err, e) {
                    if (err) return next(err);
                    console.log('qqq' + e);

                })
            })
            .on('error', function(err) {
                // handle error
            })
            .on('end', function() {
                // final callback
            });
        /*Comments.find({author:req.params.id}).snapshot().forEach(function(e) {
        e.author_name = remove_a(e.author_name);
        e.save();
    });
	*/

    }
    Users.remove({
        _id: req.params.id
    }, function(err) {
        if (err) console.log(err);
        res.redirect('/users');
    })
}
module.exports.userComments = function(req, res, next) {
    Comments.find({
        author: req.body.id
    }, function(err, comments) {
        if (err) console.log(err);
        res.send(comments);
    })

}
module.exports.delTags = function(req, res, next) {
    Tags.findById(req.params.tag, function(err, tag) {
        if (err) console.log(err);

        Posts.update({}, {
            $pull: {
                tags: tag.tag
            }
        }, {
            multi: true
        }, function(err, result) {
            if (err) console.log(err);
            res.redirect('/tags');
        })
        Tags.remove({
            _id: req.params.tag
        }, function(err) {
            if (err) console.log(err)
        })
    })
}
