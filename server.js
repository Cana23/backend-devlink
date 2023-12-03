const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const routes = require('./routes');



const port = 8082; // Define el puerto en el que deseas que se ejecute tu servidor
const app = express();

app.listen(port, () => {
    console.log(`Servidor disponible en el puerto ${port}`);
});
app.use(cors());
app.use(bodyParser.json());

//Direcciones para multer
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));



app.use('/', routes);




































