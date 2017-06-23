/**
 * Created by yih on 17.2.17.
 */
var Comment = require('./mongoose').CommentModel;
module.exports.comment = function(req, res, next) {
    res.locals.lastComments = null;
    Comment.find({
        published: true
    }, null, {
        sort: {
            modified: -1
        },
        limit: 15
    }, function(err, comments) {
        if (err) console.log(err.message);
        else res.locals.lastComments = comments;
        next();
    })
};


}
else //собственная идентификацмя
{
    req.user = res.locals.user = null;


    if (!req.session.user_id) return next();
    User.findById(req.session.user_id, function(err, user) {
        if (err) return next(err);
        if (user != null && (user.status == 'a' || user.status == 'b' || user.status == 'c')) {
            user.sign = "<a href='#'>" + user.username + "</a>";
            user.table = 'local'; //для будущих возожных личных  сообщений
            req.user = res.locals.user = user;


        } else if (user != null) req.unemail = res.locals.unemail = user.email;
        next();
    });
}
};
