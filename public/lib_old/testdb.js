/**
 * Created by yih on 5.1.17.
 */

var ArticleModel    = require('./mongoose').ArticleModel;

function testdb()
{


      this.getAll=function(func) {
        return ArticleModel.find(function (err, articles) {
            if (!err) {
                func(err,articles);

            } else {

                console.log('Internal error:' + err.message);
                var ret={code:500, status: 'Server error'};

            }
        });
    };


     this.putEx=function(callback) {
         var ret;
        var article = new ArticleModel({
            title: 'testTitle',
            author: 'testAuthor',
            description: 'testDescription',
            images: 'testImages'
        });

        article.save(function (err) {

            if (!err) {

                console.log("article created");
                ret = {status: 'ok'};
                callback(null,ret.status);

            } else {
                console.log(err);

            }
        });

    };

     this.getExId=function(callback) {
         var ret;
     ArticleModel.findById(1, function (err, article) {
            if (!article) {
                console.log('be!');
                ret='be!';
            }
            if (!err) {
                var ret = {status: 'ok', article: article};
                callback(null,ret.article);



            } else {
                var ret = {code: 500, status: 'Server error'};
               console.log('be!');
                callback(null,ret.status);

            }
            //else callback err?
        });
        console.log('trez1');

    };


    this.updateExId=function() {
        var ret;
        return ArticleModel.findById(1, function (err, article) {
            if (!article) {
                var ret = {code: '404', status: 'Not found'};
                return ret;
            }

            article.title = req.body.title;
            article.description = req.body.description;
            article.author = req.body.author;
            article.images = req.body.images;
            return article.save(function (err) {
                if (!err) {
                    console.log("article updated");
                    ret = {status: 'OK', article: article};

                } else {
                    if (err.name == 'ValidationError') {
                        var ret = {code: '400', status: 'Validation Error'};
                        return ret;


                    } else {
                        var ret = {code: '500', status: 'Server Error'};
                        return ret;
                    }
                    log.error('Internal error(%d): %s', res.statusCode, err.message);
                }
            });
        });
        callback(ret);
    };


   this.deleteEx=function() {
        return ArticleModel.findById(1, function (err, article) {
            if (!article) {
                var ret = {code: '404', status: 'Not found'};
                return ret;
            }
            return article.remove(function (err) {
                if (!err) {
                    lconsole.log("article removed");
                    var ret = {status: 'Ok'};
                    return ret;
                } else {
                    res.statusCode = 500;
                    console.log('Internal error(%d): %s' + res.statusCode + err.message);
                    var ret = {code: '404', status: 'Server error'};
                    return ret;
                }
            });
        });
    };
}
module.exports.testdb = testdb;