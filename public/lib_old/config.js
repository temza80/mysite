/**
 * Created by yih on 4.1.17.
 */
var nconf = require('nconf');

nconf.argv()
    .env()
    .file({ file: 'config.json' });

module.exports = nconf;
