const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const { emitWarning } = require('process');


const CLIENT_ID = 'eb65046c0d5c4f4b9c06'
const CLIENT_SECRET = '94bd183f5f8df34d526cebd9c674cbccc04633da'

const fetch = (...args) =>
    import ('node-fetch').then(({default: fetch})=> fetch(...args))

  
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));

app.use(session({ secret: 'holis', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());



const port = 8082; // Define el puerto en el que deseas que se ejecute tu servidor

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'devlink',
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Uploads folder where files will be saved
    },
    filename: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
});

const upload = multer({ storage: storage });
connection.connect((err) => {
    if (err) {
        console.error('Error de conexión: ' + err.stack);
        return;
    }
    console.log('Conexión a la base de datos exitosa');
});

app.get('/getAccessToken', async function (req, res){
    
    const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code;

        await fetch("https://github.com/login/oauth/access_token" + params, {
            method: "POST",
            headers: {
                "Accept": "application/json"
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            res.json(data);
        })
})

app.get('/getUserData', async function (req, res){
    req.get("Authorization")
    await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            "Authorization": req.get("Authorization")
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        res.json(data);
    })
})


app.post('/Register', async (req, res) => {
    const { username, finalEmail, password} = req.body;


    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const CHECK_EMAIL_QUERY = `SELECT * FROM Users WHERE email = '${finalEmail}'`;
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
                                const INSERT_USER_QUERY = `INSERT INTO Users (username, email, password) VALUES ('${username}', '${finalEmail}', '${hashedPassword}')`;
                                connection.query(INSERT_USER_QUERY, (err, insertResults) => {
                                    if (err) {
                                        res.status(500).send('Error al registrar el usuario');
                                        console.log(err)
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

app.get('/comentarios/:user', (req, res) => {
    const user = req.params.user
    const sql = 'SELECT * from Users where username = ?'
    console.log(user)

    connection.query(sql,user, (err, results) => {
        if (err) {
            res.status(500).send('Fallo al conseguir publicaciones');
        } else {
            res.status(200).json(results);
        }
    });
});

app.post('/Login', async (req, res) => {
    const { finalEmail, password } = req.body;
    const SELECT_USER_QUERY = `SELECT * FROM Users WHERE email = '${finalEmail}'`;

    connection.query(SELECT_USER_QUERY, async (err, results) => {
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

app.post('/register/github', (req, res) => {
    console.log(req.body)
    const user = req.body.ghUser;
    const SELECT_USER_QUERY = `SELECT * FROM Users WHERE username = '${user}'`;

    connection.query(SELECT_USER_QUERY, async (err, results) => {
        if (err) {
            res.status(500).send('Error al iniciar sesión');
        } else {
            if (results.length > 0) {
                const existingUser = results[0];
                res.status(200).json(existingUser);
                console.log('User exists');
            } else {
                console.log('User does not exist');

                const INSERT_USER_QUERY = 'INSERT INTO Users (name, username, email, password, lat, lng) VALUES (?, ?, ?, ?, ?, ?)';
                const values = [user, user, user, user, 0, 0];

                connection.query(INSERT_USER_QUERY, values, (insertErr, insertRes) => {
                    if (insertErr) {
                        res.status(500).send('Error al registrar el usuario');
                        console.log(insertErr);
                    } else {
                        const getUserQuery = 'SELECT * FROM Users WHERE Id = ?'
                        const idInsert = insertRes.insertId
                        
                            connection.query(getUserQuery,idInsert, (userErr, userRes) => {
                                if(userErr){
                                    res.status(500).send('Error al conseguir el usuario');
                                    console.log(insertErr);
                                }else {
                                    res.status(200).json(userRes[0])
                                    console.log(userRes)
                                }
                            })
                    }
                });
            }
        }
    });
});

app.post('/add/github/:id', (req, res) => {
    console.log('Encontrado')
    console.log(req.body)
    const idUser = req.params.id
    const user = req.body.ghUser;
    const SELECT_USER_QUERY = `SELECT * FROM Users WHERE username = '${user}'`;

    connection.query(SELECT_USER_QUERY, async (err, results) => {
        if (err) {
            res.status(500).send('Error al iniciar sesión');
        } else {
            if (results.length > 0) {
                const existingUser = results[0];
                res.status(500).send;
                console.log('User exists');
            } else {
                console.log('User does not exist');

                const INSERT_USER_QUERY = 'UPDATE Users SET username = ? WHERE id = ?;';
                const values = [user, idUser];

                connection.query(INSERT_USER_QUERY, values, (updateErr, updateRes) => {
                    if (updateErr) {
                        res.status(500).send('Error al renombrar al usuario');
                        console.log(insertErr);
                    } else {
                        const getUserQuery = 'SELECT * FROM Users WHERE Id = ?'
                        
                            connection.query(getUserQuery,idUser, (userErr, userRes) => {
                                if(userErr){
                                    res.status(500).send('Error al conseguir el usuario');
                                    console.log(insertErr);
                                }else {
                                    res.status(200).json(userRes[0])
                                    console.log(userRes)
                                }
                            })
                    }
                });
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

app.get('/likes/:postId', (req, res) => {
    const postId = req.params.postId;

    const GET_LIKES_QUERY = 'SELECT COUNT(*) AS likesCount FROM me_gusta WHERE id_publicacion = ?';

    connection.query(GET_LIKES_QUERY, [postId], (err, results) => {
        if (err) {
            console.error('Error al obtener likes:', err);
            res.status(500).send('Error al obtener likes');
        } else {
            const likesCount = results[0].likesCount;
            res.status(200).json({ likesCount });
        }
    });
});

app.post('/like', (req, res) => {
    const { postId, userId } = req.body;

    // Verificar si el usuario ya dio like
    const CHECK_LIKE_QUERY = 'SELECT * FROM me_gusta WHERE id_publicacion = ? AND id_usuario = ?';

    connection.query(CHECK_LIKE_QUERY, [postId, userId], (err, results) => {
        if (err) {
            console.error('Error al verificar like:', err);
            res.status(500).send('Error al verificar like');
        } else {
            if (results.length > 0) {
                // Si ya existe un like, eliminarlo
                const DELETE_LIKE_QUERY = 'DELETE FROM me_gusta WHERE id_publicacion = ? AND id_usuario = ?';

                connection.query(DELETE_LIKE_QUERY, [postId, userId], (deleteErr) => {
                    if (deleteErr) {
                        console.error('Error al eliminar like:', deleteErr);
                        res.status(500).send('Error al eliminar like');
                    } else {
                        res.status(200).send('Like eliminado exitosamente');
                    }
                });
            } else {
                // Si no existe un like, agregarlo
                const ADD_LIKE_QUERY = 'INSERT INTO me_gusta (id_publicacion, id_usuario, fecha_like) VALUES (?, ?, NOW())';

                connection.query(ADD_LIKE_QUERY, [postId, userId], (addErr) => {
                    if (addErr) {
                        console.error('Error al agregar like:', addErr);
                        res.status(500).send('Error al agregar like');
                    } else {
                        res.status(200).send('Like agregado exitosamente');
                    }
                });
            }
        }
    });
});


app.put('/editar/email/:id', (req, res) => {
    const id = req.params.id
    const newEmail = req.body.finalEmail

    console.log(newEmail)

    sql = 'UPDATE Users SET email = ? WHERE id = ?;'
    values = [newEmail, id]
    connection.query(sql,values, (err, results) => {
        if (err) {
            res.status(500).send('Fallo al editar correo');
        } else {
            res.status(200).send('Correo editado exitosamente');
        }
    })
})

app.put('/editar/password/:id', async (req, res) => {
    const id = req.params.id
    const hashedPassword = await bcrypt.hash(req.body.trimmed, 10);

    sql = 'UPDATE Users SET password = ? WHERE id = ?;'
    values = [hashedPassword, id]
    connection.query(sql,values, (err, results) => {
        if (err) {
            res.status(500).send('Fallo al editar correo');
        } else {
            res.status(200).send('Correo editado exitosamente');
        }
    })
})

app.put('/editar/description/:id', async (req, res) => {
    const id = req.params.id
    const description = req.body.description

    sql = 'UPDATE Users SET description = ? WHERE id = ?;'
    values = [description, id]
    connection.query(sql,values, (err, results) => {
        if (err) {
            res.status(500).send('Fallo al editar la descripción');
        } else {
            res.status(200).send('Descripción editada exitosamente');
        }
    })
})

app.put('/eliminar/usuario/:id', (req, res) => {
    const id = req.params.id

    sql = 'DELETE FROM Users WHERE id = ?;'
    values = [id]

    connection.query(sql,values, (err, results) => {
        if (err) {
            res.status(500).send('Fallo al eliminar usuario');
            console.log(results)
        } else {
            res.status(200).send('Usuario eliminado exitosamente');
        }
    })
})