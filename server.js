const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt'); // Importa bcrypt

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));

const port = 8082;

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage });

app.post('/Register', async (req, res) => {
    const { name, username, email, password, lat, lng } = req.body;
    console.log(lat)

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const CHECK_EMAIL_QUERY = `SELECT * FROM Users WHERE email = '${email}'`;
        connection.query(CHECK_EMAIL_QUERY, (err, results) => {
            if (err) {
                res.status(500).send('Error al verificar el correo electrónico');
            } else {
                if (results.length > 0) {
                    res.status(409).send('El correo electrónico ya está registrado');
                } else {
                    const CHECK_USERNAME_QUERY = `SELECT * FROM Users WHERE username = '${username}'`;
                    connection.query(CHECK_USERNAME_QUERY, (err, usernameResults) => {
                        if (err) {
                            res.status(500).send('Error al verificar el nombre de usuario');
                        } else {
                            if (usernameResults.length > 0) {
                                res.status(409).send('El nombre de usuario ya está registrado');
                            } else {
                                const INSERT_USER_QUERY = `INSERT INTO Users (name, username, email, password, lat, lng) VALUES ('${name}', '${username}', '${email}', '${hashedPassword}', ${lat},${lng})`;
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
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

app.post('/Login', async (req, res) => {
    const { email, password } = req.body;
    const SELECT_USER_QUERY = `SELECT * FROM Users WHERE email = '${email}'`;

    connection.query(SELECT_USER_QUERY, async (err, results) => {
        if (err) {
            res.status(500).send('Error al iniciar sesión');
        } else {
            if (results.length > 0) {
                const user = results[0];
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    res.status(200).json(user);
                } else {
                    res.status(401).send('Credenciales inválidas');
                }
            } else {
                res.status(401).send('Credenciales inválidas');
            }
        }
    });
});

app.get('/perfil/:user', (req, res) => {
    const user = req.params.user
    const sql = 'SELECT * FROM Users WHERE username = ?'

    connection.query(sql,user, (err, results) => {
        if (err) {
            res.status(500).send('Fallo al usuario');
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/publicaciones/:user', (req, res) => {
    const user = req.params.user
    const sql = 'SELECT p.*, u.username AS usuario, u.email AS correo FROM publicaciones p INNER JOIN Users u ON p.id_usuario = u.id WHERE u.username =  ?'
    console.log(user)

    connection.query(sql,user, (err, results) => {
        if (err) {
            res.status(500).send('Fallo al conseguir publicaciones');
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/comentarios/:user', (req, res) => {
    const user = req.params.user
    const sql = 'SELECT c.*, u.username AS usuario, u.email AS correo FROM comentarios c INNER JOIN Users u ON c.id_usuario = u.id WHERE u.username =  ?'
    console.log(user)

    connection.query(sql,user, (err, results) => {
        if (err) {
            res.status(500).send('Fallo al conseguir publicaciones');
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/publicaciones', (req, res) => {
    const sql = 'SELECT publicaciones.*, Users.name AS usuario, Users.email AS correo FROM publicaciones INNER JOIN Users ON publicaciones.id_usuario = Users.id;';

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching publicaciones:', err); // Add this line
            res.status(500).send('Fallo al obtener publicaciones');
        } else {
            res.status(200).json(results);
        }
    });
});

app.post('/agregarPublicaciones', upload.single('img'), (req, res) => {
    try {
      const datos = req.body;
      const imagePath = req.file.path; // Path to the uploaded file
  
      console.log(datos);
  
      const sql =
        'INSERT INTO publicaciones(titulo, contenido, likes_publicacion, id_usuario, img) VALUES (?, ?, ?, ?, ?);';
      const values = [
        datos.titulo,
        datos.contenido,
        datos.likes_publicacion,
        datos.id_usuario,
        imagePath, // Save the file path in the database
      ];
  
      connection.query(sql, values, (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).send('Fallo al agregar publicacion');
        } else {
          res.status(200).send('Publicacion agregado exitosamente');
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
    }
  });

app.post('/agregarComentarios', (req, res) => {
    const datos =  req.body
    console.log(datos)
    const sql = 'INSERT INTO comentarios (comentario,id_usuario,id_publicacion) VALUES ( ?, ?, ? );'
    const values = [datos.comentario, datos.id_usuario, datos.id_publicacion]

    connection.query(sql,values, (err, results) => {
        if (err) {
            console.log('Error: ', err)
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



app.get('/users', (req, res) => {
    const SELECT_ALL_USERS_QUERY = 'SELECT * FROM Users';

    connection.query(SELECT_ALL_USERS_QUERY, (err, results) => {
        if (err) {
            res.status(500).send('Error al obtener los usuarios');
        } else {
            res.status(200).json(results); // Enviar la lista de usuarios como respuesta
        }
    });
});