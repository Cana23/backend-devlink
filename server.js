const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 8082; // Define el puerto en el que deseas que se ejecute tu servidor

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    port: 3307,
    password: "",
    database: "DevLink"
});

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión: ' + err.stack);
        return;
    }
    console.log('Conexión a la base de datos exitosa');
});

// Ruta para registrar un usuario
app.post('/register', (req, res) => {
    const { name, username, email, password } = req.body;
    const INSERT_USER_QUERY = `INSERT INTO Users (name, username, email, password) VALUES ('${name}', '${username}', '${email}', '${password}')`;
    connection.query(INSERT_USER_QUERY, (err, results) => {
        if (err) {
            res.status(500).send('Error al registrar el usuario');
        } else {
            res.status(200).send('Usuario registrado con éxito');
        }
    });
});

// Ruta para el inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const SELECT_USER_QUERY = `SELECT * FROM Users WHERE email = '${email}' AND password = '${password}'`;
    connection.query(SELECT_USER_QUERY, (err, results) => {
        if (err) {
            res.status(500).send('Error al iniciar sesión');
        } else {
            if (results.length > 0) {
                res.status(200).send('Inicio de sesión exitoso');
            } else {
                res.status(401).send('Credenciales inválidas');
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor disponible en el puerto ${port}`);
});
