CREATE DATABASE boba;
use boba;
show tables;
select * from admin;
-- Admin Table
CREATE TABLE admin (
    admin_name VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);
INSERT INTO admin VALUES ("admin", "1234");
select * from menu_items;
select * from item_sizes;

-- Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(225) NOT NULL,
    role ENUM('cashier', 'customer'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
	Update menu_items
    set item_name="RoroMilk"
    where item_id=1;
-- Menu Items
CREATE TABLE menu_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image VARCHAR(255)	
);




-- Item Sizes with unique ID (safer referencing)
CREATE TABLE item_sizes (
    item_size_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    size ENUM('Small', 'Medium', 'Large') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE CASCADE
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    size VARCHAR(20) NOT NULL,
    toppings VARCHAR(255),
    quantity INT DEFAULT 1,
    totalprice DECIMAL(10,2) NOT NULL,
    order_status ENUM('On Process', 'Completed') DEFAULT 'On Process',
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id)
);

Select * from orders;
-- Adjusted Payments Table
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_received DECIMAL(10,2) NOT NULL,
    payment_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);




-- Micko Inventory --

CREATE TABLE inventory (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    current_stock DECIMAL(10,2) NOT NULL,
    min_stock_level DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL
);



-- Toppings 
CREATE TABLE toppings (
    topping_id INT AUTO_INCREMENT PRIMARY KEY,
    topping_name ENUM('Boba','Jellies','Pudding','Oreo') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    topping_image varchar(255)
);

select * from toppings;	
Create table menu_item_toppings(
	item_id INT,
    topping_id  INT,
    Primary Key(item_id,topping_id),
    Foreign Key (item_id) references menu_items(item_id) ON DELETE CASCADE,
    Foreign Key (topping_id) references toppings(topping_id) ON DELETE CASCADE
);	
select * from menu_items;
Update menu_items
Set image="Images/t9.png"
where item_id=9;
-- Ingredients Table (for inventory)
CREATE TABLE ingredients (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_name VARCHAR(100) NOT NULL,
    unit VARCHAR(50),
    stock_quantity DECIMAL(10,2) DEFAULT 0,
    low_stock_threshold DECIMAL(10,2) DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

	
-- Milk Tea Base (Separate if needed for customization)
CREATE TABLE milktea_base (
    base_id INT AUTO_INCREMENT PRIMARY KEY,
    base_name VARCHAR(50) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL
);

-- Sizes with Multiplier
CREATE TABLE sizes (
    size_id INT AUTO_INCREMENT PRIMARY KEY,
    size_name ENUM('Small', 'Medium', 'Large') NOT NULL,
    size_multiplier DECIMAL(4,2) DEFAULT 1.00
);

-- Toppings


-- Orders
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    customer_name VARCHAR(100),
    order_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    payment_status ENUM('pending', 'paid') DEFAULT 'pending',
    total_amount DECIMAL(10,2) DEFAULT 0
);

-- Order Items
CREATE TABLE order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_size_id INT NOT NULL, -- points to specific item and size combination
    quantity INT DEFAULT 1,
    item_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (item_size_id) REFERENCES item_sizes(item_size_id)
);

-- Order Item Toppings
CREATE TABLE order_item_toppings (
    item_topping_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    topping_id INT NOT NULL,
    FOREIGN KEY (item_id) REFERENCES order_items(item_id),
    FOREIGN KEY (topping_id) REFERENCES toppings(topping_id)
);

-- Payments
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method ENUM('cash', 'gcash') NOT NULL DEFAULT 'cash',
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
select * from menu_items;
update menu_items
set image="Images/t9.jpg"
where item_id=9;

select * from inventory;

select * from orders;




