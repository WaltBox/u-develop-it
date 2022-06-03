//Import the mysql2 package to connect MySql database
const mysql = require('mysql2');

// Connect to Database
const db = mysql.createConnection(
    {
        host:'localhost',
        // Your mySql username
        user:'root',
        // Your mySql password
        password:'Waltbox2001!!',
        database:'election'
    },
    console.log('Connected to the election database')
);

module.exports = db;