var http = require('http');
var net = require('net');
var data = new Date();
var fs = require('fs');
var queryString = require('querystring');
var server = http.createServer(whenSomeoneConnects);

function whenSomeoneConnects(request,response){
  //request is an object

  var body = null;

  //this is a request
  request.on('data',function(buffer){
    body = buffer.toString();
    console.log(body);
    body = queryString.parse(body);
    console.log(body);
    console.log('==========');
  });

  request.on('end',function(){

    //this check to see if the request is post and directed correctly
    if(request.method==='POST' && request.url==='/elements'){

      fs.writeFile('./public/'+ body.elementName + '.html', JSON.stringify(body) , function(err,data){
        if(err) throw err;

      console.log('aloha');

      });

    //make a new file in the public/js/
    //the body will be the in the js
    //

      //this ends the request
      response.end();
    }
  });
}

server.listen({port:8080}, function(){
  address = server.address();
  console.log('opened server on %j', address);
});
