const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
// const passport = require('passport'); -------------Removidos
// const session = require('express-session'); -------Removidos
const routes = require('./routes');


const port = 8082;
const app = express();

app.listen(port, () => {
    console.log(`Servidor disponible en el puerto ${port}`);
});

app.use(cors());
app.use(bodyParser.json());

//Direcciones para multer
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));

//Rutas
app.use('/', routes);