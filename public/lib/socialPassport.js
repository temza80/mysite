var socLogin = require('./mongoose').socLoginModel;
module.exports = function(app) {
    var passport = require('passport'),
        VKontakteStrategy = require('passport-vkontakte').Strategy;
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new VKontakteStrategy({
            clientID: 5915181, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
            clientSecret: "IQkC9MQTfu7XLYVNWzqx",
            callbackURL: "annamaka.in/auth/vkontakte/callback"
        },
        function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {



            socLogin.findOrCreate({
                socid: profile.id
            }, {
                type: "vk"
            }, function(err, user) {
                console.log('i-' + user + '+' + err + profile.id);
                done(null, user);
            })

        }
    ));

    // User session support for our hypothetical `user` objects.
    passport.serializeUser(function(user, done) {


        done(null, user.doc._id);
    });

    passport.deserializeUser(function(id, done) {;
        socLogin.findById(id)
            .then(function(user) {
                done(null, user);
            })
            .catch(done);
    });
    app.get('/auth/vkontakte', passport.authenticate('vkontakte'));

    app.get('/auth/vkontakte/callback',
        passport.authenticate('vkontakte', {
            successRedirect: '/',
            failureRedirect: '/login'
        })
    );
}
