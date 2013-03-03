
exports.run = function( port, callback ){
  var express = require('express');
  var partials = require('express-partials');
  var express_logger = require('express-logger');
  var ejs_locals = require('ejs-locals');
  var routes = require('./routes');
  var home = require('./routes/home');
  var http = require('http');
  var path = require('path');
  var fs = require('fs');
  var moment = require('moment');
  var ltsvlogger = require('connect-ltsv-logger');

  var app = express();
  app.configure(function(){
    app.set('port', port || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.set('template_engine', 'ejs');

    app.engine('ejs', ejs_locals);

    app.use(express.favicon());
    app.use(ltsvlogger({
        format: [ 'host', 'ident', 'user', 'time', 'req', 'status', 'size', 'referer', 'ua'],
        stream:fs.createWriteStream("logs/ltsv-access.log",{flags: 'a+'})
      }
    ));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express['static'](path.join(__dirname, 'public')));
    app.use(partials());

    //error handling
    app.use(function(err, req, res, next){
      console.error(err.stack);
      (function writeErrorLog(){
        var ws = fs.createWriteStream('logs/error.log', { flags: 'a' });
        ws.write(moment().format('YYYY/MM/DD HH:mm:ss') + ' ');
        ws.write(err.stack + '\n');
        ws.end();
      })();
      res.send(500, 'Internal Server Error.');
    });
  });

  app.configure('development', 'testing', function(){
    app.use(express.logger('dev')); //stdout
    app.use(express.errorHandler());
  });
  app.configure('production', function(){

  });

  process.on('uncaughtException', function (err) {
      console.error('uncaughtException => ' + err.stack);
  });

  app.get('/', routes.index);
  app.get(/^\/[\w\-_]+\/*$/, home.index);

  var server = http.createServer(app);
  server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
    if(callback){
      callback(server, app);
    }
  });
};


