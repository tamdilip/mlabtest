var express=require('express');
var app=express();
app.set('port', (process.env.PORT || 5000));

var fs = require('fs');
var http = require('http');
var serve = http.createServer(app);
var io = require('socket.io')(serve);


var MongoClient = require('mongodb').MongoClient;

var ObjectID = require('mongodb').ObjectID;

var uristring = process.env.MONGOLAB_URI;
var myCollection;

var data;

var db= MongoClient.connect(uristring, function(err, db) {
  
      if(err)
           
 throw err;
      
  console.log("connected to the mongoDB !");
       
 myCollection = db.collection('cm');

});

serve.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});


app.get('/',function(req,res){

    res.writeHead(200, { 'Content-type': 'text/html'});

    res.end(fs.readFileSync(__dirname + '/index.html'));
});



io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {

        socket.broadcast.emit('message', 'disconnected');

        console.log('user disconnected');
    });

    socket.on('message', function (msg) {

	  myCollection.insert({msg:msg}, function(err, doc) {
		
console.log('New User Registered');

res.json(doc);

console.log(doc);

  });

        console.log('Message Received: ', msg);

        socket.broadcast.emit('message', msg);

    });
});
