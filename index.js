var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

app.get('/', function (req, res) {
  res.send('Hello Express JS!');
});



app.get('/hello', function (req, res) {
  res.send('Hello Express JS!');
});


app.post('/hello',function(req,res){
	// res.sendFile(path.join(__dirname+'/home.html'));
	res.send("Its a post request");
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(3000, function () {
  console.log('App listening on port 3000!');
});