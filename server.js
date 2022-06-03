const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();
// Allows us to use the inputCheck function in Post route
const inputCheck= require('./utils/inputCheck');

//Import the mysql2 package to connect MySql database
const mysql = require('mysql2');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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

// Get All Candidates

app.get('/api/candidates',(req,res) => {
    const sql = `SELECT candidates.*, parties.name 
    AS party_name 
    FROM candidates 
    LEFT JOIN parties 
    ON candidates.party_id = parties.id`;

    db.query(sql,(err,rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message:'success',
            data: rows
        });
    });
});

// Get a single candidate

app.get('/api/candidate/:id', (req,res) => {
    const sql = `SELECT candidates.*, parties.name 
    AS party_name 
    FROM candidates 
    LEFT JOIN parties 
    ON candidates.party_id = parties.id 
    WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err,row) => {
        if(err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

app.delete('/api/candidate/:id',(req,res) => {
    const sql = 'DELETE FROM candidates WHERE id =?';
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message});
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        }else{
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
     });
});
//CREATE A NEW CANDIDATE

app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if(errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`;

    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql,params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
// Might need to move this above const sql
});

db.query
// Default response for any other request (Not Found) Known as a catchall route.
app.use((req,res) => {
    res.status(404).end();
});
// Function to start the server on Port 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});