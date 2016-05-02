var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var Keycloak = require('keycloak-connect');
var session = require('express-session');

function helloRoute() {
  var hello = new express.Router();
  hello.use(cors());
  hello.use(bodyParser());
  
  var memoryStore = new session.MemoryStore();

hello.use( session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
} ));

var keycloak = new Keycloak({
  store: memoryStore
});

hello.use( keycloak.middleware( {
  logout: '/logout',
  admin: '/',
} ));


  // GET REST endpoint - query params may or may not be populated
  hello.get('/', keycloak.protect(), function(req, res) {
    console.log(new Date(), 'In hello route GET / req.query=', req.query);
    var world = req.query && req.query.hello ? req.query.hello : 'World';

    // see http://expressjs.com/4x/api.html#res.json
    res.json({msg: 'Hello ' + world});
  });

  // POST REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
  // This can also be added in application.js
  // See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
  hello.post('/', keycloak.protect(), function(req, res) {
    console.log(new Date(), 'In hello route POST / req.body=', req.body);
    var world = req.body && req.body.hello ? req.body.hello : 'World';

    // see http://expressjs.com/4x/api.html#res.json
    res.json({msg: 'Hello ' + world});
  });

  return hello;
}

module.exports = helloRoute;
