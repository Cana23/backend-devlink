const dotenv = require('dotenv');
const mysql = require('mysql');

dotenv.config();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'devlink',
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    return;
  }
});

module.exports = connection;
