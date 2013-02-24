var config = require('config');
var operate = require('./operate');
var async = require('async');

var mongo_url = config.db.mongodb.url;
console.log('mongo_url' , mongo_url);
var mongo_operate = operate.create(config.db.mongodb.url);


async.series([
    function (callback) {
        mongo_operate.dropCollections(function(err){
            if(err){ console.error(err); /* callback(err); return; */ }
            callback();
        });
    },
    function(callback) {
        mongo_operate.ensureIndexes(function(err){
            if(err){ console.error(err); callback(err); return; }
            callback();
        });
    },
    function(callback) {
        mongo_operate.seed(function(err){
            if(err){ console.error(err); callback(err); return; }
            callback();
        });
    }
]);

