const mysql = require("mysql");

const inquirer = require("inquirer");

require("console.table")

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    database: "bamazon_db",
    user: "root",
    password: "root"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    inventorySearch();
});

function inventorySearch() {
    connection.query("SELECT item_id, product_name, price FROM products",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            confirmItem();
        })
};

function confirmItem() {
    inquirer.prompt([
        {
            message: "What is the item ID?",
            name: "itemID",
            type: "input",
        },
        {
            message: "How many do you want?",
            name: "quantity",
            type: "input",
        }
    ]).then(function (response) {
        console.log(response);
        connection.query("SELECT stock_quantity FROM products WHERE item_id = ?",
            [response.itemID],
            function (error, res) {
                if (res[0].stock_quantity - parseInt(response.quantity) > 0) {

                    console.log("Thank you for your purchase!");

                    // connection.query("UPDATE stock_quantity FROM products WHERE quantity = ?");


                } else {
                    console.log("Sorry, insufficient quantity. Please change your quantity, or check back for restock.")
                    confirmItem();
                }
                // console.log(res);
            })
    })
};  