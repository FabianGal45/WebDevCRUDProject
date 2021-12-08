var express = require('express');
var router = express.Router();
var MySql = require('sync-mysql');

//get = show data
router.get('/', function(req, res, next) {
  var error = req.query.error 
  var connection = new MySql({
    host: 'localhost',
    user: 'root',
    password: 'passwordformysql',
    database: 'pc_world'
  });
  var services = connection.query('SELECT * FROM services;');
  res.render('services', {
    title: 'Services',
    services: services,
    error: error
  });
});

router.get('/update', function(req, res, next){ //or it can be edit
  var serviceID = req.query.serviceID;
  var error = req.query.error
  res.render("update_services", { //name of the ejs file
    title: 'Update Services',
    serviceID: serviceID,
    error: error
  });
});


//post = take in data
//res is what we want when comming out
router.post('/add', function(req, res, next){ 
  var serviceID = req.body.serviceID;
  var serviceName = req.body.serviceName;
  var customerName = req.body.customerName;
  var productID = req.body.productID;
  var serviceDescription = req.body.serviceDescription;
  var connection = new MySql({
    host: 'localhost',
    user: 'root',
    password: 'passwordformysql',
    database: 'pc_world'
  });

  //checks to see if the ID already exists and throws an error if it does.
  var services = connection.query('SELECT * FROM services;');
  for(var i=0; i < services.length; i++){
    console.log(services[i].serviceID + " " +serviceID);
    if(serviceID == services[i].serviceID){
      console.log("THERE IS A MATCH!!! "+ services[i].serviceID)
      res.redirect("/services/?&error=You cannot use the same ID")
    } 
  }

  connection.query('INSERT INTO services(serviceID, serviceName, customerName, productID, serviceDescription) VALUES ((?), (?), (?), (?), (?));', [serviceID, serviceName, customerName, productID, serviceDescription]);

  console.log(req.body.item_name);  
  res.redirect("/services");
});

router.post('/delete', function(req, res, next){
  var connection = new MySql({
    host: 'localhost',
    user: 'root',
    password: 'passwordformysql',
    database: 'pc_world'
  });
  
  var delete_id = req.body.serviceID;//takes the staff_id from the html file
  connection.query('DELETE FROM services WHERE serviceID=(?);', [delete_id]);//we need to have the variable in square brackets as there can be multiple questrion marks in the query
  res.redirect("/services"); //go back to the /staff page to start again.
});

router.post('/update', function(req, res, next){
  var serviceID = req.body.serviceID;
  var newServiceID = req.body.new_serviceID
  var serviceName = req.body.serviceName;
  var customerName = req.body.customerName;
  var productID = req.body.productID;
  var serviceDescription = req.body.serviceDescription;
  var connection = new MySql({
    host: 'localhost',
    user: 'root',
    password: 'passwordformysql',
    database: 'pc_world'
  });
  
  var query_string = "UPDATE services set"
  var params = []
  if(newServiceID) {
    query_string += ' serviceID = (?)'
    params.push(newServiceID)
  }
  if(serviceName) {
    if(newServiceID) {
      query_string +=", "
    }
    query_string += ' serviceName = (?) '
    params.push(serviceName)
  }
  if(customerName) {
    if(newServiceID || serviceName) {
      query_string +=", "
    }
    query_string += ' customerName = (?) '
    params.push(customerName)
  }
  if(productID) {
    if(newServiceID || serviceName || customerName) {
      query_string +=", "
    }
    query_string += ' productID = (?) '
    params.push(productID)
  }
  if(serviceDescription) {
    if(newServiceID || serviceName || customerName || productID) {
      query_string +=", "
    }
    query_string += ' serviceDescription = (?) '
    params.push(serviceDescription)
  }
  query_string += " WHERE serviceID = (?)"
  params.push(serviceID)

  //if nothing has been inserted inthe fieleds it will throw an error
  if(!newServiceID && !serviceName && !customerName && !productID && !serviceDescription) {
    res.redirect("/services/update?serviceID=" + serviceID + "&error=You must update some fields")
  }
  
  //checks to see if the ID already exists and throws an error if it does.
  var services = connection.query('SELECT * FROM services;');
  for(var i=0; i < services.length; i++){
    console.log(services[i].serviceID + " " +newServiceID);
    if(newServiceID == services[i].serviceID){
      console.log("THERE IS A MATCH!!! "+ services[i].serviceID)
      res.redirect("/services/update?serviceID=" + serviceID + "&error=You cannot use the same ID")
    } 
  }

  

  console.log(">>> Query "+ query_string);
  console.log(">>> Params "+ params)

  connection.query(query_string, params)
  res.redirect("/services");
});


module.exports = router;
