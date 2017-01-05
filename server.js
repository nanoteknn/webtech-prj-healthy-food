var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();

var Sequelize = require("sequelize");
var sequelize = new Sequelize('food_db', 'ionutweiscovici', '', {
   dialect: 'mysql',
   host: '127.0.0.1',
   port: 3306
});

sequelize.authenticate()
    .then(function () {
        console.log("CONNECTED! ");
    })
    .catch(function (err) {
        console.log("SOMETHING DONE GOOFED");
    })
    .done();

var Item = sequelize.define('Item', {
    name:Sequelize.STRING,
    calories: Sequelize.INTEGER,
    points: Sequelize.INTEGER
}, {
  tableName: 'Items', // this will define the table's name
  timestamps: false  // this will deactivate the timestamp columns
});

var Item = sequelize.define('Item', {
    name:Sequelize.STRING,
    calories: Sequelize.INTEGER,
    points: Sequelize.INTEGER
}, {
  tableName: 'Items', // this will define the table's name
  timestamps: false  // this will deactivate the timestamp columns
});
 
var Report = sequelize.define('Report', {
    calories: Sequelize.INTEGER,
    points: Sequelize.INTEGER
}, {
  tableName: 'Reports', // this will define the table's name
});
 
Item.hasOne(Item, {as: 'Father'})
 
sequelize.sync().then(function (err) {
 console.log("sync successful");
});

Item.findOne({where : {name: 'Meat'}}).then(function(user) {
    if(!user)
    {
      var newItem = Item.build({
        name: 'Meat', 
        calories: 500, 
        points: 10
        });
        newItem.save().then(function() {
      // Do stuffs after data persists
        });  
    }
});

Item.findOne({where : {name: 'Water'}}).then(function(user) {
    if(!user)
    {
      var newItem = Item.build({
        name: 'Water', 
        calories: 1, 
        points: 25
        });
        newItem.save().then(function() {
      // Do stuffs after data persists
        });  
    }
});

Item.findOne({where : {name: 'Beer'}}).then(function(item) {
    if(!item)
    {
      var newItem = Item.build({
        name: 'Beer', 
        calories: 500, 
        points: -5,
        });
        newItem.save().then(function() {
        // Do stuffs after data persists
        });  
    }
});

Item.findOne({where : {name: 'Water'}}).then(item=>{
    var wantedId = item.id;
    Item.findOne({where : {name: 'Beer'}}).then(t=>{
    t.updateAttributes({
        ItemId: wantedId
    });
});
});

app.use(bodyParser.json());
app.use(cors());

//how to load static files from a specific folter
//first param is the URL, second param is the folder to load files from
app.use('/dashboard', express.static('dashboard'));
app.use('/healty_calculator', express.static('healty_calculator'));
app.use('/reports', express.static('reports'));
app.get('/', function(req, res) {
    res.redirect("/dashboard");
});

var nodeadmin = require('nodeadmin');
app.use(nodeadmin(app));

// REST methods
app.get('/items_get', function(req,res){ 
    Item.findAll({limit: 100}).then(function(items) {
    res.status(200).send(items);
    });
});

app.get('/items:id_get', function(req,res){ 
    const id = req.params.id;
    Item.find({where: {id: id}})
    .then(owner=> {
       res.status(200).send(owner); 
    });
});

app.get('/items:name_get', function(req,res){ 
    const name = req.params.name;
    Item.find({where: {name: name}})
    .then(owner=> {
       res.status(200).send(owner); 
    });
});

app.post('/items_post', (req, res) => {
    const name = req.body.name;
    const calories = req.body.calories;
    const points = req.body.points;
    const itemId = req.body.ItemId;
    Item.findOne({where : {name: name}}).then(foundItem => {
        if(!foundItem) {
        var newItem = Item.build({
            name: name, 
            calories: calories, 
            points: points,
            });
            newItem.save().then(function() {
            // Do stuffs after data persists
            });        
        }
    });
});

app.get('/reports_get', function(req,res){ 
    Report.findAll({limit: 100}).then(function(items) {
    res.status(200).send(items);
    });
});
  
app.post('/reports_post', (req, res) => {
    const caloriesString = req.body.calories;
    const pointsString = req.body.points;
    var finalPoints = pointsString.substring(pointsString.length-3, pointsString.length);
    var finalCalories = caloriesString.substring(caloriesString.length-3, caloriesString.length);
            var newItem = Report.build({
            points: finalPoints, 
            calories: finalCalories, 
            });
            newItem.save().then(function() {
            // Do stuffs after data persists
            });        
});
  
app.put('/items/:id_update', (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const calories = req.body.calories;
    const points = req.body.points;
    Item.find({
      where: { id: id }
    })
      .then(owner => {
        if(owner)
        {
          owner.updateAttributes({
            name: name,
            calories: calories,
            points: points
          })  
        }
      });
  });

app.delete('/items/:id_delete', (req, res) => {
    const toRemoveId = req.body.id;
    
    Item.destroy({
    where: {id: toRemoveId},
    truncate: false,
    function(result) {
      var a = 123;
    }
    });
    
    // Item.destroy({id:toRemoveId},function(result) {
    //   return res.send(result);
    // });
    
    // Item.destroy({
    //   where: { id: id }
    // })
    //   .then(deletedOwner => {
    //     var smtgin;a
    //   });
  });


app.listen(process.env.PORT);