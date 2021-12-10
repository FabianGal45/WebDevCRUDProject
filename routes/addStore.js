var express = require('express');
var router = express.Router();
var MySql = require('sync-mysql');
var connection_details = require("../modules/connection_details")


router.get('/', function(req, res, next) {
  var storeID = req.body.storeID
  var location = req.body.location
  var error = req.query.error;
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });

  var store = connection.query('SELECT * from store;');
  var staff = connection.query('SELECT * from staff;');
  console.log(store)

  res.render('addStore', {
    title: 'Store',
    store: store,
    staff: staff,
    error: error
  });
});

router.get('/updateStore', function(req, res, next){
  var storeID = req.query.storeID;
  var location = req.query.location;
  var error = req.query.error;
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
  connection.query("INSERT INTO store (storeID, location) VALUES ((?), (?));", [storeID, location]); //query to insert the users inputs into respective variables.

  console.log(req.body.storeID , req.body.location);
  res.redirect("/addStore"); //after adding the addStore page is reloaded.
})

router.get('/delete', function(req, res, next) {
  var storeID = req.query.storeID
  var location = req.query.location
  var error = req.query.error;
  var staff = req.query.staff
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  var staff = connection.query('SELECT * FROM staff'); //I take everything from the staff table in order to check if a staff member works at a existing store.
  for(var i=0; i < staff.length; i++){//looks at everything
    if(storeID == staff[i].storeID){// checks if storeID's match
      res.redirect("/addStore/?&error=Cannot delete as people work there.") // if a store with staff exists then that store cannot be deleted.
    }
  }
  connection.query("DELETE FROM store WHERE storeID = (?);", [storeID])//deletes storeID
  connection.query("DELETE FROM store WHERE location = (?)", [location])//Deletes the location
  res.redirect('/addStore')
})

router.post('/updateStore', function(req, res, next){
  var storeID= req.body.storeID;
  var location = req.body.location;
  var newStoreID = req.body.newStoreID;//takes in the input for updated storeID as were using the storeID variable to get the row thats being edited.
  console.log(storeID,location, newStoreID);

  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  })
  console.log(location, storeID);
  var query_string = "UPDATE store set"//used to store the query which will be updated as the if statement goes on
  var params = []
  if(newStoreID) {//if statement to replace data
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
    res.redirect("/addStore/updateStore?storeID=" + storeID + "&error=You must update some fields")//error appears if user doesnt update anything
  }
  params.push(storeID)
  console.log("query:" +query_string+ " params: "+params);
  connection.query(query_string, params)
  res.redirect("/addStore");
});


module.exports = router;
