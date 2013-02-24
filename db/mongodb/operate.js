var mongoskin = require('mongoskin');
var async = require('async');
var _ = require('underscore');

var collections = [
    { name: 'users' },
    { name: 'groups', indexes: [ { keys: { user_id: 1, group_id: 1 } } ] },
    { name: 'commands', indexes: [ { keys: { user_id: 1, group_id: 1, command_id: 1 } } ] }
];

var users_data = [
    { _id: "user1" , created_at: new Date() },
    { _id: "user2", created_at: new Date() }
];

exports.create = function(url){
    return {
        dropCollections : function(callback){
            console.log("- dropCollections start.");
            var db = mongoskin.db(url, { w: 1});
            async.forEachSeries(collections, function(collection, cb) {
                db.collection(collection.name).drop(function(err, result){
                    if(err){ cb(err); return; }
                    console.log("collection %s is dropped.", collection.name);
                    cb();
                });
            }, function (err) {
                db.close();
                console.log("- dropCollections finished.");
                if(err){ console.error(err); callback(err); return;}
                callback();
            });
        },

        ensureIndexes: function( callback ){
            console.log("- setIndexes start.");
            var db = mongoskin.db(url, { w: 1});

            //outer loop
            async.forEachSeries(collections, function(collection, cb_outer) {
                var indexes = collection.indexes;
                if(!indexes){
                    cb_outer();
                    return;
                }
                //inner loop
                async.forEach( indexes, function(index, cb_inner) {
                  var keys = index.keys;
                  var unique =  index.unique ? true: false;
                  db.collection(collection.name).ensureIndex( keys, unique,
                        function(err, result){
                            if( !err ){
                                console.log('-- index ensured. %s', JSON.stringify(collection));
                            }
                            cb_inner(err);
                        }
                  );
                }, function (err) {
                  cb_outer(err);
                });
                //inner loop end.

            }, function (err) {
                db.close();
                if(err){ console.error(err); return;}
                console.log("- setIndexes finished.");
                callback();
            });
            //outer loop end.
        },

        seed : function(callback){
            console.log("- seed start.");
            var db = mongoskin.db(url, { w: 1});
            async.waterfall([
                function addUsers(callback) {
                    console.log("-- addUsers start.");
                    var users =  db.collection('users');
                    users.insert(users_data, { safe: true}, function(err, result){
                        console.log("-- addUsers end");
                        if(err){
                            callback(err);return;
                        }
                        callback();
                    });
                },
                function addGroups(callback){
                    console.log("-- addGroups start.");
                    var groups =  db.collection('groups');
                    var groups_data =  [
                        {
                            user_id: "user1", group_id: "linux", order: 1,
                            created_at: new Date()
                        },
                        {
                            user_id: "user1", group_id: "git", order: 1,
                            created_at: new Date()
                        },
                        {
                            user_id: "user2", group_id: "linux", order: 1,
                            created_at: new Date()
                        }
                    ];
                    groups.insert( groups_data,  { safe: true }, function(err, result){
                        console.log("-- addGroups end");
                        if(err){
                            callback(err);return;
                        }
                        callback();
                    } );
                },
                function addCommands(callback){
                    console.log("-- addCommands start.");
                    var command_template =
                        {
                            user_id: "xxxx", group_id: "linux",
                            command_id: "find",
                            category: "file",
                            description : "ファイルやディレクトリを検索する",
                            syntax: "find [path...] [option]",
                            tags: [ "search" ],
                            detail_description: "ファイルやディレクトリを検索する。expressionはオプション、判別式およびアクションの組み合わせからなる。pathは検索するディレクトリを示し、これ以下のディレクトリが検索対象となる。",
                            options: [
                                {
                                    "option" : "-name",
                                    "alias" : "",
                                    "explanation" : "ファイル名を指定。ワイルドカードが利用可能。"
                                },
                                {
                                    "option" : "-type",
                                    "alias" : "",
                                    "explanation" : "ファイルの種類を指定。d：ディレクトリ　l：シンボリックリンク　f：通常ファイル"
                                }
                            ],
                            examples: [
                                {
                                    "command" : "find . -name '*~' -exec rm {} \\; -print",
                                    "explanation" : "最後に~のついているファイルを削除する",
                                    "result" : ""
                                },
                                {
                                    "command" : "find ~ -name file1 -ls",
                                    "explanation" : "ホームディレクトリを検索して詳細表示",
                                    "result" : "104738698        0 -rw-r--r--    1 tshimogaisho     staff                   0 Nov 25 14:08 ./file1"
                                }
                            ]
                        };

                    var collection = db.collection('commands');
                    async.forEach(users_data, function(user, cb) {
                        var commands = [];
                        for (var i = 1; i <= 20; i++){
                            var command = _.clone(command_template);
                            command.user_id = user._id;
                            command.command_id = 'command' + i;
                            commands.push(command);
                        }
                        collection.insert( commands, { safe: true }, function( err ){
                            cb(err);
                        } );

                    }, function (err) {
                        console.log("-- addGroups end");
                        if(err){
                            callback(err);return;
                        }
                        callback();
                    });
                    console.log("-- end");
                    callback();
                }

            ], function (err, result) {
                db.close();
                if (err) { throw err; }
                console.log('- seed finished. ');
                callback();
            });
        }
    };
};