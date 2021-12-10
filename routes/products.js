//File Edited by Fabian.
//References class notes and exercises

var express = require('express');
var router = express.Router();
var MySql = require('sync-mysql');
var connection_details = require("../modules/connection_details");

// Displays and creates the main /products route
router.get('/', function(req, res, next) {
  var error = req.query.error 
  // connect to the database
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  //creates a list with all the products and sends them over to the ejs file
  var products = connection.query('SELECT * FROM products;');
  res.render('products', {
    title: 'Products',
    products: products,
    error: error
  });
});

// Displays and creates the /products/update route
router.get('/update', function(req, res, next){ //or it can be edit
  var product_id = req.query.product_id; //grabs the product id from the query/url of the file
  var error = req.query.error //grabs any error that might come in the query/url of the file
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  //grabs all the information related to the product that is being updated or edited
  var products = connection.query('SELECT * FROM products WHERE itemID=(?);',[product_id]);
  res.render("update_products", { //sends over the variables to the update_products file
    title: 'Update Products',
    product_id: product_id,
    error: error,
    products: products
  });
});

//creates the /add post route that will be adding any infromation gathered from the /products page and adding them to the database.
router.post('/add', function(req, res, next){ 
  var itemName = req.body.item_name;
  var itemCategory = req.body.item_category;
  var itemStock = req.body.item_stock;
  var itemDescription = req.body.item_description;
  var itemPrice = req.body.item_price;
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  connection.query('INSERT INTO products(itemName, category, stock, itemDescription, price) VALUES ((?), (?), (?), (?), (?));', [itemName, itemCategory, itemStock, itemDescription, itemPrice]);
  res.redirect("/products");//redirects the user back to the /products page
});

router.post('/delete', function(req, res, next){
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  
  var delete_id = req.body.prduct_id;//takes the staff_id from the html file
  connection.query('DELETE FROM products WHERE itemID=(?);', [delete_id]);
  res.redirect("/products"); //go back to the /staff page to start again.
});


router.post('/update', function(req, res, next){
  var product_id = req.body.item_id;
  var product_name = req.body.item_name;
  var itemCategory = req.body.item_category;
  var itemStock = req.body.item_stock;
  var itemDescription = req.body.item_description;
  var itemPrice = req.body.item_price;
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  //starts the query and attaches pieces to it based on the variables that are being used.
  var query_string = "UPDATE products set"
  var params = []
  if(product_name) {
    query_string += ' itemName = (?) '
    params.push(product_name);
  }
  if(itemCategory) {
    if(product_name) {
      query_string +=", "
    }
    query_string += ' category = (?) '
    params.push(itemCategory)
  }
  if(itemStock) {
    if(product_name || itemCategory) {
      query_string +=", "
    }
    query_string += ' stock = (?) '
    params.push(itemStock);
  }
  if(itemDescription) {
    if(product_name || itemCategory || itemStock) {
      query_string +=", "
    }
    query_string += ' itemDescription = (?) '
    params.push(itemDescription);
  }
  if(itemPrice) {
    if(product_name || itemCategory || itemStock|| itemDescription) {
      query_string +=", "
    }
    query_string += ' price = (?) '
    params.push(itemPrice);
  }
  query_string += " WHERE itemID = (?)"

  //if nothing has been inserted inthe fieleds it will throw an error
  if(!product_name && !itemCategory && !itemStock && !itemDescription  && !itemPrice) {
    res.redirect("/products/update?product_id=" + product_id + "&error=It doesn't seem like you changed anything. You must update at least one field.");
  }

  params.push(product_id);

  // Logs used to troubleshoot the app
  // console.log(">>> Query "+ query_string);
  // console.log(">>> Params "+ params)
  connection.query(query_string, params);
  res.redirect("/products");
});


module.exports = router;
