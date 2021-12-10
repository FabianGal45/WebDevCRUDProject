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
  var products = connection.query('SELECT * FROM products;');
  res.render('products', {
    title: 'Products',
    products: products,
    error: error
  });
});

router.get('/update', function(req, res, next){ //or it can be edit
  var product_id = req.query.product_id;
  var error = req.query.error
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  var products = connection.query('SELECT * FROM products WHERE itemID=(?);',[product_id]);
  console.log(products)
  res.render("update_products", { //name of the ejs file
    title: 'Update Products',
    product_id: product_id,
    error: error,
    products: products
  });
});


//post = take in data
//res is what we want when comming out
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

  console.log(req.body.item_name);  
  res.redirect("/products");
});

router.post('/delete', function(req, res, next){
  var connection = new MySql({
    host: connection_details.host,
    user: connection_details.user,
    password: connection_details.password,
    database: connection_details.database
  });
  
  var delete_id = req.body.prduct_id;//takes the staff_id from the html file
  connection.query('DELETE FROM products WHERE itemID=(?);', [delete_id]);//we need to have the variable in square brackets as there can be multiple questrion marks in the query
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
  
  var query_string = "UPDATE products set"
  var params = []
  if(product_name) {
    query_string += ' itemName = (?) '
    params.push(product_name)
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
    params.push(itemStock)
  }
  if(itemDescription) {
    if(product_name || itemCategory || itemStock) {
      query_string +=", "
    }
    query_string += ' itemDescription = (?) '
    params.push(itemDescription)
  }
  if(itemPrice) {
    if(product_name || itemCategory || itemStock|| itemDescription) {
      query_string +=", "
    }
    query_string += ' price = (?) '
    params.push(itemPrice)
  }
  query_string += " WHERE itemID = (?)"

  //if nothing has been inserted inthe fieleds it will throw an error
  if(!product_name && !itemCategory && !itemStock && !itemDescription  && !itemPrice) {
    res.redirect("/products/update?product_id=" + product_id + "&error=It doesn't seem like you changed anything. You must update at least one field.")
  }

  params.push(product_id)

  console.log(">>> Query "+ query_string);
  console.log(">>> Params "+ params)
  connection.query(query_string, params)
  res.redirect("/products");
});


module.exports = router;
