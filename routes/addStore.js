var express = require('express');
var router = express.Router();
var MySql = require('sync-mysql');
var connection_details = require("../modules/connection_details")

//
router.get('/', function(req, res, next) {
  var storeID = req.body.storeID
  var location = req.body.location
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });

  var store = connection.query('SELECT * from store;');
  console.log(store)

  res.render('addStore', {
    title: 'Store',
    store: store
  });
});

router.get('/updateStore', function(req, res, next){
  var storeID = req.query.storeID;
  var location = req.query.location;

  res.render("updateStore", {
    title: 'Updated Store',
    storeID: storeID ,
    location: location
  });
});

router.post('/add', function (req, res, next) {
  var storeID = req.body.storeID
  var location = req.body.location
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  connection.query("INSERT INTO store (storeID, location) VALUES ((?), (?));", [storeID, location]);

  console.log(req.body.storeID , req.body.location);
  res.redirect("/addStore");
})

router.get('/delete', function(req, res, next) {
  var storeID = req.query.storeID
  var location = req.query.location
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  connection.query("DELETE FROM store WHERE storeID = (?);", [storeID])
  connection.query("DELETE FROM store WHERE location = (?)", [location])
  res.redirect('/addStore')
})

router.post('/updateStore', function(req, res, next){
  var storeID= req.body.storeID;
  var location = req.body.location;
  var newStoreID = req.body.newStoreID;
  console.log(storeID,location, newStoreID);

  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  })
  console.log(location, storeID);
  var query_string = "UPDATE store set"
  var params = []
  if(newStoreID) {
    query_string += ' storeID = (?)'
    params.push(newStoreID)
  }
  if(location) {
    if(newStoreID) {
      query_string +=", "
    }
    query_string += ' location = (?) '
    params.push(location)
  }
  query_string += "WHERE storeID = (?)"
  if(!newStoreID && !location) {
    res.redirect("/addStore/updateStore?storeID=" + storeID + "&error=You must update some fields")
  }
  params.push(storeID)
  console.log("query:" +query_string+ " params: "+params);
  connection.query(query_string, params)
  res.redirect("/addStore");
});


module.exports = router;
