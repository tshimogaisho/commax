var server = require("../../server");

var should = require('should');
var restler = require('restler');
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
    restler.get('http://localhost:3000').on('complete', function( data, response ){
        should.exist(data);
        response.statusCode.should.equal(200);
        done();
    });
  });
  after(function(done){
      httpServer.close();
      done();
  });

});