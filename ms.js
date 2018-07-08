var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"db_role"
});

var app = require('express')(),
    express = require('express'),
    bodyparser = require("body-parser"),
    path    = require("path"),
    PORT = 3000;
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyparser.json({
  limit: "10mb"
}));

app.use(bodyparser.urlencoded({
  limit: "10mb",
  extended: true,
  parameterLimit: 50000
}));

app.use((req, res, next) => {
  const allowOrigin = req.headers.origin || "http://localhost:" + PORT;
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authentication, x-access-token");
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.setHeader('Strict-Transport-Security','max-age=5');
  res.setHeader('From','webmaster@example.org');
  next();
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){

  res.sendFile(__dirname + '/index.html');

});

io.on('connection', function(socket){
    
  con.query("SELECT * FROM db_v1_salaries", function (err, result, fields) {
    // console.log("iocalled",3)
    if (err) throw err;
    console.log("socket mysql:",result);
    io.emit('mysqls', result);
  });

});

app.get('/ms',function(req,res){
  
  con.query("SELECT * FROM db_v1_salaries", function (err, result, fields) {
    console.log("called",5)
    if (err) throw err;
    console.log("socket mysql:",result);
    io.emit('mysqls', result);
    res.send({'status':'ok'});
  });

});

app.post('/ms',function(req,res){

  var id = req.body.id;
  var userid = req.body.userid;
  var salary = req.body.salary;

  var sql = "UPDATE db_v1_salaries SET salary = "+salary+" WHERE id = "+id+" and userid = "+userid;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
    con.query("SELECT * FROM db_v1_salaries", function (err, result, fields) {
      console.log("called",5)
      if (err) throw err;
      console.log("socket mysql:",result);
      io.emit('mysqls', result);
      res.send({'status':'ok'});
    });
  });

});

http.listen(PORT, function(){
  console.log('listening on *:3000');
});