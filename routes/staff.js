var express = require('express');
var router = express.Router();
var MySql = require('sync-mysql');
var connection_details = require("../modules/connection_details")

/* GET users listing. */
router.get('/', function(req, res, next) {
  var staffID = req.body.staffID
  var staffType = req.body.staffType
  var fName = req.body.fName
  var lName = req.body.lName
  var hourlyPay = parseFloat(req.body.hourlyPay)
  var storeID = req.query.storeID
  var error = req.query.error;
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  var staff = connection.query("SELECT * from staff");
  var store = connection.query("SELECT * from store");
  console.log(staff);

  res.render('staff', {
    title: 'Staff',
    staff:staff,
    store:store,
    error: error
  });
});

router.get('/add', function(req, res, next){
  res.render('add', {title: 'Add staff member'})
})

router.get('/delete', function(req, res, next) {
  var staffID = req.query.staffID
  var staffType = req.query.staffType
  var fName = req.query.fName
  var lName = req.query.lName
  var hourlyPay = parseFloat(req.query.hourlyPay)
  var staffID = req.query.staffID
  var error = req.query.error
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  connection.query("DELETE FROM staff where staffID = (?);", [staffID])
  res.redirect('/staff')
})

router.post('/add', function(req, res, next) {
  var staffID = req.body.staffID
  var staffType = req.body.staffType
  var fName = req.body.fName
  var lName = req.body.lName
  var storeID = req.body.storeID
  var hourlyPay = parseFloat(req.body.hourlyPay)
  console.log(staffID, staffType, fName, lName, hourlyPay, storeID);
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  //query to add data into database tables.
  connection.query("INSERT INTO staff (staffID, staffType, fName, lName, hourlyPay , storeID) VALUES ((?), (?), (?), (?), (?), (?));", [staffID, staffType, fName, lName, hourlyPay, storeID]);
  res.redirect("/staff");
})

router.get('/updateStaff', function(req, res, next){ //or it can be edit
  var staffID = req.query.staffID
  var staffType = req.query.staffType
  var error = req.query.error
  var fName = req.query.fName
  var lName = req.query.lName
  var hourlyPay = parseFloat(req.query.hourlyPay)
  var storeID = req.query.storeID
  var connection = new MySql({
  host: connection_details.host,
  user: connection_details.user,
  password: connection_details.password,
  database: connection_details.database
  });

  var staff = connection.query('SELECT * FROM staff WHERE staffID=(?);',[staffID]);//used to get the staffID
  var store = connection.query('SELECT * FROM store;');//used to get the StoreID
  res.render("updateStaff", {
    title: 'Update Staff',
    staffID: staffID,
    staffType: staffType,
    fName: fName,
    lName: lName,
    hourlyPay: hourlyPay,
    storeID: storeID,
    error: error,
    store: store,
    staff: staff
  });
});

router.post('/updateStaff', function(req, res, next){
  var staffID = req.body.staffID
  var newStaffID = req.body.newStaffID
  var staffType = req.body.staffType
  var fName = req.body.fName
  var lName = req.body.lName
  var hourlyPay = parseFloat(req.body.hourlyPay)
  var storeID = req.body.storeID
  console.log(staffID, staffType, fName, lName, hourlyPay);
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });

  var query_string = "UPDATE staff set"//stores update query that will be updated in the if statement
  var params = []
  if(newStaffID) {
    query_string += ' staffID = (?)'
    params.push(newStaffID)
  }
  if(staffType) {
    if(newStaffID) {
      query_string +=", "
    }
    query_string += ' staffType = (?) '
    params.push(staffType)
  }
  if(fName) {
    if(newStaffID || staffType) {
      query_string +=", "
    }
    query_string += ' fName = (?) '
    params.push(fName)
  }
  if(lName) {
    if(newStaffID|| staffType || fName) {
      query_string +=", "
    }
    query_string += ' lName = (?) '
    params.push(lName)
  }
  if(hourlyPay) {
    if(newStaffID|| staffType || fName || lName) {
      query_string +=", "
    }
    query_string += ' hourlyPay = (?) '
    params.push(hourlyPay)
  }
  query_string += "WHERE staffID = (?)"
  if(!newStaffID && !staffType && !fName && !lName && !hourlyPay && !storeID ) {
    res.redirect("/staff/updateStaff?staffID=" + staffID + "&error=You must update some fields")
  }
  params.push(staffID)
  console.log("query:" +query_string+ " params: "+params);
  connection.query(query_string, params)
  res.redirect("/staff");
  });

module.exports = router;
