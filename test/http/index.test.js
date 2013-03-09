var should = require('should');
var request = require('request');

var server = require("../../server");

var routes = require('../../routes');

describe('index', function(){
  var httpServer;
  before(function(done) {
    server.run( 3000, function(server, app){
      done();
      httpServer = server;
    });
  });
  it('#show index page', function(done){
    request.get('http://localhost:3000',  function(err, res, body){
      should.not.exist(err);
      res.statusCode.should.equal(200);
      done();
    });
  });
  after(function(done){
    httpServer.close();
    done();
  });
});