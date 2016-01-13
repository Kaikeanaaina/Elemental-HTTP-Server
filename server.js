var http = require( 'http' );
var net = require( 'net' );
var data = new Date( );
var fs = require( 'fs' );
var queryString = require( 'querystring' );
var server = http.createServer ( whenSomeoneConnects );
var indexCount = 1;
var h3 = '<h3>These are '+ indexCount +'</h3>' ;
var replacedData = null ;

function whenSomeoneConnects ( request , response ){
  //request is an object
  var body = null ;

  //to know what the body
  request.on ( 'data' , function ( buffer ) {
    body = buffer.toString();
    body = queryString.parse( body );
  });

  request.on( 'end' , function ( ){

    //this check to see if the request is post and directed correctly
    if( request.method === 'POST' && request.url === '/elements' )
      fs.readdir( './public/' , function ( err , file ) {
        var putElements = file.filter( filteredArray );
        function filteredArray( element , index , array ){
          return element !== '404.html' && element !== 'css' && element !== 'index.html' && element !== 'js';
        }
         console.log( putElements );
         console.log( putElements[1] );
         console.log( body.elementName );
         console.log( body.elementName+'.html' );
         console.log( putElements.indexOf( body.elementName + '.html' ));

         console.log( putElements.indexOf( body.elementName + '.html' ) === -1 );


        if( putElements.indexOf( body.elementName + '.html' ) === -1 ){
          if( body.hasOwnProperty( 'elementName' )&&
             body.hasOwnProperty( 'elementSymbol' )&&
             body.hasOwnProperty( 'elementAtomicNumber' )&&
             body.hasOwnProperty( 'elementDescription' )) {
            //this is when the template file is being used
            fs.readFile( './template/template.html' , function ( err , data ){
              var readableData = data.toString( );
              //this is when i change the template
              var change = readableData.replace('|| elementName ||' , body.elementName )
                                       .replace('|| elementName ||' , body.elementName )
                                       .replace('|| elementSymbol ||' , body.elementSymbol )
                                       .replace('|| elementAtomicNumber ||', body.elementAtomicNumber)
                                       .replace('|| elementDescription ||', body.elementDescription);

              //console.log(change);
              //this is when the new file is created

              fs.writeFile( './public/' + body.elementName + '.html' , change , function ( err , data ){
                if(err) console.log (err);
                //change the index.html
                //console.log('1111111111111');
                fs.readdir('./public/', function(err,file){
                  //file is an array
                  //console.log("22222222222222");
                  var elements = file.filter(filteredArray);
                  function filteredPostArray(element,index,array){
                    return element !== '404.html' && element !== 'css' && element !== 'index.html' && element !== 'js';
                  }
                  indexCount = elements.length;

                  fs.readFile('./template/index.html', function(err,data){
                    console.log('3333333333333');
                    var newData = data.toString();
                    console.log(elements);
                    // if(elements.length ===2){
                    // replacedData = newData.replace('<h3> These are '+ indexCount + ' </h3>', '<h3> These are ' + (indexCount) + ' </h3>' );
                    // indexCount ++;
                    // }
                    // else{
                    replacedData = newData.replace('<h3> These are '+ (indexCount-1) + ' </h3>', '<h3> These are ' + (elements.length) + ' </h3>' );
                    indexCount ++;
                    //}

                    //now to insert the new li elements
                    replacedData = replacedData.replace('</ol>', '  <li>\n      <a href="/'+ body.elementName + '.html">'+body.elementName.toLowerCase()+'</a>\n    </li>\n  </ol>');

                    fs.writeFile('./template/index.html', replacedData , function(err,data){
                      console.log('4444444444444');
                      if(err){
                        fs.readFile('./public/404.html', function (err, data) {
                          if(err) throw err;
                          response.write(data);
                          return response.end();
                        });
                      } else {
                        // console.log('555555555');
                        var resBody = JSON.stringify({success : true});
                        response.writeHead(200, {
                          'Content-Length': resBody.length,
                          'Content-Type': 'application/json'

                        });

                        response.end(resBody);
                      }
                    });
                  });
                });
              });
            });

            //this ends the request
          } else{
            fs.readFile('./public/404.html', function (err, data) {
              if(err) throw err;
              response.write(data);
              //return socketReq.end();
            });
          }
        }
        else{
          console.log('there is already an existing file by that name');
          return 'there is already an existing file by that name';
        }
      });





     else if(request.method==='PUT' && request.url=== '/elements'){
        fs.readdir('./public/', function(err, file){
        console.log('222222222222222222222');
        var putElements = file.filter(filteredArray);
        function filteredArray(element,index,array){
          return element !== '404.html' && element !== 'css' && element !== 'index.html' && element !== 'js';
        }
         console.log(putElements);
         console.log(putElements[1]);
         console.log(body.elementName);
         console.log(body.elementName+'.html');
         console.log(putElements.indexOf(body.elementName+'.html'));

         console.log(putElements.indexOf(body.elementName+'.html')!==-1);


        if(putElements.indexOf(body.elementName+'.html')!==-1){
          if(body.hasOwnProperty('elementName')&&
             body.hasOwnProperty('elementSymbol')&&
             body.hasOwnProperty('elementAtomicNumber')&&
             body.hasOwnProperty('elementDescription')) {
            //this is when the template file is being used
            fs.readFile('./template/template.html', function(err,data){
              var readableData=data.toString();
              //this is when i change the template
              var change = readableData.replace('|| elementName ||', body.elementName)
                                       .replace('|| elementName ||', body.elementName)
                                       .replace('|| elementSymbol ||', body.elementSymbol)
                                       .replace('|| elementAtomicNumber ||', body.elementAtomicNumber)
                                       .replace('|| elementDescription ||', body.elementDescription);

              //console.log(change);
              //this is when the new file is created

              fs.writeFile('./public/'+ body.elementName + '.html', change , function(err,data){
                if(err) console.log (err);
                var resBody = JSON.stringify({success : true});
                        response.writeHead(200, {
                          'Content-Length': resBody.length,
                          'Content-Type': 'application/json'

                        });
                response.end(resBody);
              });
            });
            //this ends the request
          } else{
            fs.readFile('./public/404.html', function (err, data) {
              if(err) throw err;
              response.write(data);
              //return socketReq.end();
            });
          }
        }

        else{
          console.log('there is no element by that name');
          return 'there is no element by that name';
        }
      });
     }


  });
}

server.listen({port:8080}, function(){
  address = server.address();
  console.log('opened server on %j', address);
});
