var express = require('express');
var router = express.Router();
var checkAuth=require('../public/lib/checkAuth');

/* GET home page. */
router.get('/', function(req, res, next) {
console.log(Date.now());
    res.redirect('/posts');

});
module.exports = router;
