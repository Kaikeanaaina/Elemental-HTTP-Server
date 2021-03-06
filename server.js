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
    if( request.method === 'POST' && request.url === '/elements' ){
      fs.readdir( './public/' , function ( err , file ) {
        var postElements = file.filter( filteredPostArray );
        function filteredPostArray( element , index , array ){
          return element !== '404.html' && element !== 'css' && element !== 'index.html' && element !== 'js';
        }

        if( postElements.indexOf( body.elementName + '.html' ) === -1 ){
          if( body.hasOwnProperty( 'elementName' )&&
              body.hasOwnProperty( 'elementSymbol' )&&
              body.hasOwnProperty( 'elementAtomicNumber' )&&
              body.hasOwnProperty( 'elementDescription' )) {
            //this is when the template file is being used
            fs.readFile( './template/template.html' , function ( err , data ){
              var readableData = data.toString( );
              //this is when i change the template
              var change = readableData.replace( '|| elementName ||' , body.elementName )
                                       .replace( '|| elementName ||' , body.elementName )
                                       .replace( '|| elementSymbol ||' , body.elementSymbol )
                                       .replace( '|| elementAtomicNumber ||', body.elementAtomicNumber)
                                       .replace( '|| elementDescription ||', body.elementDescription);

              //console.log(change);
              //this is when the new file is created

              fs.writeFile( './public/' + body.elementName + '.html' , change , function ( err , data ){
                if(err) console.log (err);
                //change the index.html
                //console.log('1111111111111');
                fs.readdir( './public/', function ( err , file ){
                  //file is an array
                  //console.log("22222222222222");
                  var elements = file.filter( filteredArray );
                  function filteredPostArray( element , index,array ){
                    return element !== '404.html' && element !== 'css' && element !== 'index.html' && element !== 'js';
                  }
                  indexCount = elements.length;

                  fs.readFile( './template/index.html' , function ( err , data ){
                    //console.log('3333333333333');
                    var newData = data.toString();
                    //console.log(elements);

                    replacedData = newData.replace( '<h3> These are '+ ( indexCount - 1 ) + ' </h3>', '<h3> These are ' + ( elements.length ) + ' </h3>' );
                    indexCount ++ ;

                    //now to insert the new li elements
                    replacedData = replacedData.replace( '</ol>' , '  <li>\n      <a href="/'+ body.elementName + '.html">' + body.elementName.toLowerCase() +'</a>\n    </li>\n  </ol>');

                    fs.writeFile( './template/index.html' , replacedData , function( err , data ){
                      //console.log('4444444444444');
                      if( err ){
                        fs.readFile('./public/404.html', function ( err , data ) {
                          if( err ) throw err;
                          response.write( data );
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
          } else {
            fs.readFile( './public/404.html' , function ( err , data ) {
              if( err ) throw err;
              response.write( data );
              //return socketReq.end();
            });
          }
        }
        else{
          console.log( 'there is already an existing file by that name' );
          return 'there is already an edxisting file by that name' ;
        }
      });
    }

    else if( request.method === 'PUT' ){
        fs.readdir( './public/' , function( err , file ){
        var putElements = file.filter( filteredPutArray );
        function filteredPutArray( element , index , array ){
          return element !== '404.html' && element !== 'css' && element !== 'index.html' && element !== 'js';
        }

        if( putElements.indexOf( body.elementName + '.html' ) !== -1 ){
          if( body.hasOwnProperty( 'elementName' ) &&
              body.hasOwnProperty( 'elementSymbol' ) &&
              body.hasOwnProperty( 'elementAtomicNumber' ) &&
              body.hasOwnProperty( 'elementDescription' )) {
            //this is when the template file is being used
            fs.readFile( './template/template.html' , function( err , data ){
              var readableData = data.toString();
              //this is when i change the template
              var change = readableData.replace( '|| elementName ||', body.elementName )
                                       .replace( '|| elementName ||', body.elementName )
                                       .replace( '|| elementSymbol ||', body.elementSymbol )
                                       .replace( '|| elementAtomicNumber ||', body.elementAtomicNumber )
                                       .replace( '|| elementDescription ||', body.elementDescription );

              //console.log(change);
              //this is when the new file is created

              fs.writeFile( './public/' + body.elementName + '.html' , change , function( err , data ){
                if( err ) throw ( err );
                var resBody = JSON.stringify( { success : true } ) ;
                        response.writeHead( 200 , {
                          'Content-Length': resBody.length,
                          'Content-Type': 'application/json'

                        });
                response.end( resBody ) ;
              });
            });
            //this ends the request
          } else {
            fs.readFile( './public/404.html' , function ( err , data ) {
              if( err ) throw err;
              response.write( data );
              //return socketReq.end();
            });
          }
        }

        else{
          console.log( 'there is no element by that name' );
          return 'there is no element by that name' ;
        }
      });
    }

    else if( request.method === 'GET' ) {
      if( request.url === '/' ){
        request.url = '/index.html' ;
      }
      if( request.url === '/index.html' ){
        fs.readFile( './template' + request.url , function ( err , file ){
          if ( err ) console.log ( err );
          response.write( file.toString() );
          response.end();
        });
      } else {
        fs.readFile( './public' + request.url , function ( err , file ){
          if ( err ) console.log ( err );
          response.write( file.toString() );
          response.end();
        });
      }
    }

    else if(request.method === 'DELETE' ) {
      fs.readdir( './public/' , function( err , file ){
        if ( err ) throw( err );

          var deleteElements = file.filter( filteredDeleteArray );

          function filteredDeleteArray( element , index , array ){
            return element !== '404.html' && element !== 'css' && element !== 'index.html' && element !== 'js' ;
          }

          var urlSplit = request.url.split('');
          urlSplit.splice(0,1);
          var joinUrl = urlSplit.join('');

          if( deleteElements.indexOf( joinUrl ) !== -1 ){
             console.log( 'alohaaaaaaaaa' );
            response.end();
          }


      });
    }

  });
}

server.listen({port:8080}, function(){
  address = server.address();
  console.log('opened server on %j', address);
});
