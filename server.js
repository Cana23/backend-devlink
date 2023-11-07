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
app.post('/Register', (req, res) => {
    const { name, username, email, password } = req.body;

    // Verificar si el correo electrónico ya existe en la base de datos
    const CHECK_EMAIL_QUERY = `SELECT * FROM Users WHERE email = '${email}'`;

    connection.query(CHECK_EMAIL_QUERY, (err, results) => {
        if (err) {
            res.status(500).send('Error al verificar el correo electrónico');
        } else {
            if (results.length > 0) {
                // El correo ya está registrado
                res.status(409).send('El correo electrónico ya está registrado');
            } else {
                // El correo no está registrado, procede con la verificación de nombre de usuario
                const CHECK_USERNAME_QUERY = `SELECT * FROM Users WHERE username = '${username}'`;

                connection.query(CHECK_USERNAME_QUERY, (err, usernameResults) => {
                    if (err) {
                        res.status(500).send('Error al verificar el nombre de usuario');
                    } else {
                        if (usernameResults.length > 0) {
                            // El nombre de usuario ya está registrado
                            res.status(409).send('El nombre de usuario ya está registrado');
                        } else {
                            // El correo y el nombre de usuario no están registrados, procede con la inserción
                            const INSERT_USER_QUERY = `INSERT INTO Users (name, username, email, password) VALUES ('${name}', '${username}', '${email}', '${password}')`;

                            connection.query(INSERT_USER_QUERY, (err, insertResults) => {
                                if (err) {
                                    res.status(500).send('Error al registrar el usuario');
                                } else {
                                    res.status(200).send('Usuario registrado con éxito');
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});

// Ruta para el inicio de sesión
app.post('/Login', (req, res) => {
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

// Ruta seguir a un usuario
router.post('/seguir/:idUsuarioSeguido', (req, res) => {
    const idUsuarioSeguidor = req.body.idUsuarioSeguidor;
    const idUsuarioSeguido = req.params.idUsuarioSeguido;
  
    const query = 'INSERT INTO seguir (id_usuario_seguidor, id_usuario_seguido) VALUES (?, ?)';
    pool.query(query, [idUsuarioSeguidor, idUsuarioSeguido], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Error al seguir al usuario' });
      } else {
        res.status(200).json({ message: 'Usuario seguido con éxito' });
      }
    });
  });
  
  // Ruta "me gusta"
  router.post('/like', (req, res) => {
    const { idUsuario, idPublicacion, idComentario } = req.body; // Asegúrate de enviar estos datos en el cuerpo de la solicitud
  
    const query = 'INSERT INTO me_gusta (id_usuario, id_publicacion, id_comentario, fecha_like) VALUES (?, ?, ?, NOW())';
    pool.query(query, [idUsuario, idPublicacion, idComentario], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Error al dar "me gusta"' });
      } else {
        res.status(200).json({ message: 'Me gusta agregado con éxito' });
      }
    });
  });

app.listen(port, () => {
    console.log(`Servidor disponible en el puerto ${port}`);
});
