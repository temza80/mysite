var User=require('../public/lib/mongoose').LoginModel;
exports.get=function(req,res) {
    var user = new User({username: 'admin', password: 'adminqQ1wW', email: 'temza80@gmail.com', status: 'a'});
    user.save(function (err) {
        if (err) {
            console.log(err.message);
            return callback(err);
        }

    })
}
