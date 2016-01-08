var http = require('http');
var net = require('net');
var url = require('url');

var date = new Date();
var PORT = 8080;
var HOST = 'localhost';

var client = net.connection({port:PORT,host:HOST},function(){
  console.log('Connected');


});