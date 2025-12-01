const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:4200'}));

// Connect Mysql Database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "user_info",
  port: 3306,
});

// Check database connection
db.connect(err => {
    if(err) { console.log('error');
     }
     console.log('Database Connected Successfully !!!');
     
});



// Get All Data
app.get('/users', (req, res) => {
    let q = `SELECT * FROM users`;
    db.query(q,(err, results) => {
        if (err) {
            console.log('err', err);
            
        }
        if (results.length > 0) {
            res.send({
                message: 'All Users Data',
                data: results
            });
        }
    });
});

// Get Single User Data
app.get('/users/:id', (req, res) => {
    let qId = req.params.id;
    let qr = `SELECT * FROM users WHERE id = ${qId}`;
    db.query(qr, (err, results) => {
        if (err) {
            console.log(err);
            
        }
        if (results.length > 0) {
            res.send({
                message: "Get data by ID",
                data: results
            });
        }
    });
});

// Post User Data
app.post('/users', (req, res) => {
    
    const { fullname, email, mobile } = req.body;

    // Requête SQL sécurisée
    const qr = `INSERT INTO users(fullname, email, mobile) VALUES (?, ?, ?)`;

    db.query(qr, [fullname, email, mobile], (err, result) => {
        if (err) {
            console.log("❌ SQL Insert Error:", err);
            return res.status(500).json({ message: "Database Insert Error", error: err });
        }

        if (result.affectedRows > 0) {
            return res.status(201).json({
                message: "User created successfully",
                data: result.insertId
            });
        }

        return res.status(400).json({
            message: "Something went wrong..."
        });
    });
});

// Update User Data
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { fullname, email, mobile } = req.body;

    const qr = `UPDATE users SET fullname = ?, email = ?, mobile = ? WHERE id = ?`;

    db.query(qr, [fullname, email, mobile, id], (err, result) => {
        if (err) {
            console.log("❌ SQL Update Error:", err);
            return res.status(500).json({ message: "Database Update Error", error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User updated successfully",
            affectedRows: result.affectedRows
        });
    });
});

// Delete User
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;

    const qr = `DELETE FROM users WHERE id = ?`;

    db.query(qr, [userId], (err, result) => {
        if (err) {
            console.log("❌ SQL Delete Error:", err);
            return res.status(500).json({ 
                message: "Database Delete Error", 
                error: err 
            });
        }

        // Vérifier si l'utilisateur existe
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        return res.status(200).json({
            message: "User deleted successfully",
            affectedRows: result.affectedRows
        });
    });
});




app.listen(3000, () =>
  console.log("Server is Starting 3000 PORT, GKFCSolution")
);




// app.use('/discussions', routes);
