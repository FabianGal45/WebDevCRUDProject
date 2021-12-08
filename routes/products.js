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
  res.render("update_products", { //name of the ejs file
    title: 'Update Products',
    product_id: product_id,
    error: error
  });
});


//post = take in data
//res is what we want when comming out
router.post('/add', function(req, res, next){ 
  var itemID = req.body.item_id;
  var itemName = req.body.item_name;
  var itemCategory = req.body.item_category;
  var itemStock = req.body.item_stock;
  var itemDescription = req.body.item_description;
  var itemPrice = req.body.item_price;
  var connection = new MySql({
    host: 'localhost',
    user: 'root',
    password: 'passwordformysql',
    database: 'pc_world'
  });

  //checks to see if the ID already exists and throws an error if it does.
  var products = connection.query('SELECT * FROM products;');
  for(var i=0; i < products.length; i++){
    console.log(products[i].itemID + " " +itemID);
    if(itemID == products[i].itemID){
      console.log("THERE IS A MATCH!!! "+ products[i].itemID)
      res.redirect("/products/?&error=You cannot use the same ID")
    } 
  }

  connection.query('INSERT INTO products(itemID, itemName, category, stock, itemDescription, price) VALUES ((?), (?), (?), (?), (?), (?));', [itemID, itemName, itemCategory, itemStock, itemDescription, itemPrice]);

  console.log(req.body.item_name);  
  res.redirect("/products");
});

router.post('/delete', function(req, res, next){
  var connection = new MySql({
    host: 'localhost',
    user: 'root',
    password: 'passwordformysql',
    database: 'pc_world'
  });
  
  var delete_id = req.body.prduct_id;//takes the staff_id from the html file
  connection.query('DELETE FROM products WHERE itemID=(?);', [delete_id]);//we need to have the variable in square brackets as there can be multiple questrion marks in the query
  res.redirect("/products"); //go back to the /staff page to start again.
});

router.post('/update', function(req, res, next){
  var product_id = req.body.item_id;
  var newProductID = req.body.new_item_id
  var product_name = req.body.item_name;
  var itemCategory = req.body.item_category;
  var itemStock = req.body.item_stock;
  var itemDescription = req.body.item_description;
  var itemPrice = req.body.item_price;
  var connection = new MySql({
    host: 'localhost',
    user: 'root',
    password: 'passwordformysql',
    database: 'pc_world'
  });
  
  var query_string = "UPDATE products set"
  var params = []
  if(newProductID) {
    query_string += ' itemID = (?)'
    params.push(newProductID)
  }
  if(product_name) {
    if(newProductID) {
      query_string +=", "
    }
    query_string += ' itemName = (?) '
    params.push(product_name)
  }
  if(itemCategory) {
    if(newProductID || product_name) {
      query_string +=", "
    }
    query_string += ' category = (?) '
    params.push(itemCategory)
  }
  if(itemStock) {
    if(newProductID || product_name || itemCategory) {
      query_string +=", "
    }
    query_string += ' stock = (?) '
    params.push(itemStock)
  }
  if(itemDescription) {
    if(newProductID || product_name || itemCategory || itemStock) {
      query_string +=", "
    }
    query_string += ' itemDescription = (?) '
    params.push(itemDescription)
  }
  if(itemPrice) {
    if(newProductID || product_name || itemCategory || itemStock) {
      query_string +=", "
    }
    query_string += ' price = (?) '
    params.push(itemPrice)
  }
  query_string += " WHERE itemID = (?)"
  

  //if nothing has been inserted inthe fieleds it will throw an error
  if(!newProductID && !product_name && !itemCategory && !itemStock && !itemDescription  && !itemPrice) {
    res.redirect("/products/update?product_id=" + product_id + "&error=You must update some fields")
  }
  
  //checks to see if the ID already exists and throws an error if it does.
  var products = connection.query('SELECT * FROM products;');
  for(var i=0; i < products.length; i++){
    console.log(products[i].itemID + " " +newProductID);
    if(newProductID == products[i].itemID){
      console.log("THERE IS A MATCH!!! "+ products[i].itemID)
      res.redirect("/products/update?product_id=" + product_id + "&error=You cannot use the same ID")
    } 
  }
  
  params.push(product_id)
  console.log("")

  console.log(">>> Query "+ query_string);
  console.log(">>> Params "+ params)
  connection.query(query_string, params)
  res.redirect("/products");
});


module.exports = router;
