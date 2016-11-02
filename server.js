var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/admin', express.static('admin'));
app.use('/pos', express.static('pos'));

app.get('/products', function(req,res){
    res.status(200).send([{name:"COCA_COLA",price:2.99},{name:"PEPSI",price:2.66}]);
});

app.listen(process.env.PORT);