var server = require("../server");
var should = require('should');

describe('server', function(){
    var httpServer;
    it('#run', function(){
      server.run( 3000, function(server, app){
        should.exist(app);
        app.get('port').should.equal(3000);
        httpServer = server;
      });
    });
    after(function(done){
      httpServer.close();
      done();
    });
  });