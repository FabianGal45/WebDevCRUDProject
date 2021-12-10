var express = require('express');
var router = express.Router();
var MySql = require('sync-mysql');
var connection_details = require("../modules/connection_details")

//get = show data
router.get('/', function(req, res, next) {
  var error = req.query.error 
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  var services = connection.query('SELECT * FROM services;');
  var products = connection.query('SELECT * FROM products;');
  res.render('services', {
    title: 'Services',
    services: services,
    error: error,
    products: products
  });
});

router.get('/update', function(req, res, next){ //or it can be edit
  var serviceID = req.query.serviceID;
  var error = req.query.error
    var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  var services = connection.query('SELECT * FROM services WHERE serviceID=(?);',[serviceID]);//used to get the service information
  var products = connection.query('SELECT * FROM products;');//used to get the product id
  var originalProductID = connection.query('SELECT productID FROM services WHERE serviceID=(?);',[serviceID]); 
  console.log(originalProductID[0].productID);
  res.render("update_services", { //name of the ejs file
    title: 'Update Services',
    serviceID: serviceID,
    error: error,
    services: services,
    products: products,
    originalProductID: originalProductID
  });
});


//post = take in data
//res is what we want when comming out
router.post('/add', function(req, res, next){ 
  var serviceName = req.body.serviceName;
  var customerName = req.body.customerName;
  var productID = req.body.productID;
  var serviceDescription = req.body.serviceDescription;
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });

  connection.query('INSERT INTO services(serviceName, customerName, productID, serviceDescription) VALUES ((?), (?), (?), (?));', [serviceName, customerName, productID, serviceDescription]);

  console.log(req.body.item_name);  
  res.redirect("/services");
});

router.post('/delete', function(req, res, next){
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  
  var delete_id = req.body.serviceID;//takes the staff_id from the html file
  connection.query('DELETE FROM services WHERE serviceID=(?);', [delete_id]);//we need to have the variable in square brackets as there can be multiple questrion marks in the query
  res.redirect("/services"); //go back to the /staff page to start again.
});

router.post('/update', function(req, res, next){
  var serviceID = req.body.serviceID;
  var serviceName = req.body.serviceName;
  var customerName = req.body.customerName;
  var productID = req.body.productID;
  var serviceDescription = req.body.serviceDescription;
  var updatedProductID=false;
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  console.log("ServiceID >>>> "+serviceID);
  var originalProductID = connection.query('SELECT productID FROM services WHERE serviceID=(?);',[serviceID]);
  console.log("Original product ID >>>> "+originalProductID[0]);

  var query_string = "UPDATE services set"
  var params = []

  if(serviceName) {
    query_string += ' serviceName = (?) '
    params.push(serviceName)
  }
  if(customerName) {
    if(serviceName) {
      query_string +=", "
    }
    query_string += ' customerName = (?) '
    params.push(customerName)
  }
  //check to see if the input in the productID input box is the same with the service it is trying to change.
  // if(productID != originalProductID[i].productID){
  //   console.log("BOOOOOOOOM THERE IS A MATCH - NOthing has been updated");
  //   updatedProductID=false;
  // }

  if(originalProductID!=productID){
    //the product Id has been updated/changed
    console.log("The product ID has been changed");
    updatedProductID=true;
  }
  if(updatedProductID) {
    if(serviceName || customerName) {
      query_string +=", "
    }
    query_string += ' productID = (?) '
    params.push(productID)
  }
  if(serviceDescription) {
    if(serviceName || customerName || productID) {
      query_string +=", "
    }
    query_string += ' serviceDescription = (?) '
    params.push(serviceDescription)
  }
  query_string += " WHERE serviceID = (?)"
  params.push(serviceID)

  //if nothing has been inserted inthe fieleds it will throw an error
  if(!serviceName && !customerName && updatedProductID && !serviceDescription) {
    res.redirect("/services/update?serviceID=" + serviceID + "&error=It doesn't seem like you changed anything.")
  }

  console.log(">>> Query "+ query_string);
  console.log(">>> Params "+ params)

  connection.query(query_string, params)
  res.redirect("/services");
});


module.exports = router;
