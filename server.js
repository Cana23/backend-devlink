const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 8082; // Define el puerto en el que deseas que se ejecute tu servidor

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
                // Envía la información del usuario en lugar de un mensaje de éxito
                res.status(200).json(results[0]);
            } else {
                res.status(401).send('Credenciales inválidas');
            }
        }
    });
});

app.get('/publicaciones', (req, res) => {
    console.log('Request recibido en /publicaciones'); // Add this line
    const sql = 'SELECT publicaciones.*, Users.name AS usuario, Users.email AS correo FROM publicaciones INNER JOIN Users ON publicaciones.id_usuario = Users.id;';

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching publicaciones:', err); // Add this line
            res.status(500).send('Fallo al obtener publicaciones');
        } else {
            console.log('Publicaciones obtenidas correctamente'); // Add this line
            res.status(200).json(results);
        }
    });
});

app.post('/agregarPublicaciones', (req, res) => {
    const datos =  req.body
    const sql = 'INSERT INTO publicaciones(titulo,contenido,likes_publicacion) VALUES ( ?, ?, ? );'
    const values = [datos.titulo, datos.contenido, datos.likes_publicacion]

    connection.query(sql,values, (err, results) => {
        if (err) {
            res.status(500).send('Fallo al agregar publicacion');
        } else {
            res.status(200).send('Publicacion agregado exitosamente');
        }
    })
})

app.post('/agregarComentarios', (req, res) => {
    const datos =  req.body
    const sql = 'INSERT INTO comentarios (comentario,id_usuario,id_publicacion) VALUES ( ?, ?, ? );'
    const values = [datos.comentario, datos.id_usuario, datos.id_publicacion]

    connection.query(sql,values, (err, results) => {
        console.log(results)
        if (err) {
            res.status(500).send('Fallo al agregar comentario');
        } else {
            res.status(200).send('Comentario agregado exitosamente');
        }
    })
})

// Ruta para dar like a una publicación
app.post('/posts/:postId/like', (req, res) => {
    const { postId, userId } = req.body;
    const sql = 'INSERT INTO me_gusta (id_publicacion, id_usuario, fecha_like) VALUES (?, ?, NOW())';
    const values = [postId, userId];

    connection.query(sql, values, (err, results) => {
        if (err) {
            res.status(500).send('Error al dar like a la publicación');
        } else {
            res.status(200).send('Like agregado a la publicación exitosamente');
        }
    });
});

// Ruta para quitar like a una publicación
app.delete('/posts/:postId/unlike', (req, res) => {
    const { postId, userId } = req.body;
    const sql = 'DELETE FROM me_gusta WHERE id_publicacion = ? AND id_usuario = ?';
    const values = [postId, userId];

    connection.query(sql, values, (err, results) => {
        if (err) {
            res.status(500).send('Error al quitar like de la publicación');
        } else {
            res.status(200).send('Like eliminado de la publicación exitosamente');
        }
    });
});

// Ruta para dar like a un comentario
app.post('/comentarios/:comentarioId/like', (req, res) => {
    const { comentarioId, userId } = req.body;
    const sql = 'INSERT INTO me_gusta (id_comentario, id_usuario, fecha_like) VALUES (?, ?, NOW())';
    const values = [comentarioId, userId];

    connection.query(sql, values, (err, results) => {
        if (err) {
            res.status(500).send('Error al dar like al comentario');
        } else {
            res.status(200).send('Like agregado al comentario exitosamente');
        }
    });
});

// Ruta para quitar like a un comentario
app.delete('/comentarios/:comentarioId/unlike', (req, res) => {
    const { comentarioId, userId } = req.body;
    const sql = 'DELETE FROM me_gusta WHERE id_comentario = ? AND id_usuario = ?';
    const values = [comentarioId, userId];

    connection.query(sql, values, (err, results) => {
        if (err) {
            res.status(500).send('Error al quitar like del comentario');
        } else {
            res.status(200).send('Like eliminado del comentario exitosamente');
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor disponible en el puerto ${port}`);
});
