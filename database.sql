DROP DATABASE IF EXISTS pc_world;
CREATE DATABASE pc_world;
USE pc_world;

#Tomas
CREATE TABLE store(
storeID VARCHAR(255) NOT NULL PRIMARY KEY ,
location VARCHAR(255)
);

CREATE TABLE staff(
staffID VARCHAR(255) NOT NULL PRIMARY KEY ,
staffType VARCHAR(255),
fName VARCHAR(255),
lName VARCHAR(255),
hourlyPay FLOAT NOT NULL,
storeID VARCHAR(255),
FOREIGN KEY (storeID) REFERENCES store(storeID)
);

# Fabian
CREATE TABLE products (
	itemID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    itemName VARCHAR(255),
    category VARCHAR(255),
    stock INT,
    itemDescription VARCHAR(255),
    price DOUBLE
);

CREATE TABLE services (
	serviceID INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    serviceName VARCHAR(255),
    customerName VARCHAR(255),
    productID INT NOT NULL,
    serviceDescription VARCHAR(255),
	FOREIGN KEY (productID) REFERENCES products(itemID) ON DELETE CASCADE
);
