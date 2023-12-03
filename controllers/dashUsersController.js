const connection = require('../db/dbConfig')

const dashUsersController = {

    getUser: (req, res) => {
        const userId = req.params.id;
        const SELECT_USER_BY_ID_QUERY = 'SELECT * FROM Users WHERE id = ?';
    
        connection.query(SELECT_USER_BY_ID_QUERY, [userId], (err, results) => {
            if (err) {
                res.status(500).send('Error al obtener el usuario');
            } else {
                if (results.length > 0) {
                    res.status(200).json(results[0]); // Enviar el usuario encontrado como respuesta
                } else {
                    res.status(404).send('Usuario no encontrado');
                }
            }
        });
    },
    
    
    // anadir
    addUser: (req, res) => {
        const { name, username, email, password, description, lat, lng } = req.body;
    
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
                                const INSERT_USER_QUERY = `INSERT INTO Users (name, username, email, password, description, lat, lng) VALUES ('${name}', '${username}', '${email}', '${password}', '${description}', '${lat}', '${lng}')`;
    
                                connection.query(INSERT_USER_QUERY, (err, insertResults) => {
                                    if (err) {
                                        res.status(500).send('Error al agregar el usuario');
                                    } else {
                                        res.status(200).send('Usuario agregado con éxito');
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    },
    // editar
    editUser: (req, res) => {
        const userId = req.params.id;
        const { name, username, email, password, description, lat, lng } = req.body;
        const UPDATE_USER_QUERY = 'UPDATE Users SET name=?, username=?, email=?, password=?, description=?, lat=?, lng=? WHERE id=?';
    
        connection.query(
            UPDATE_USER_QUERY,
            [name, username, email, password, description, lat, lng, userId],
            (err, results) => {
                if (err) {
                    res.status(500).send('Error al editar el usuario');
                } else {
                    res.status(200).send('Usuario editado con éxito');
                }
            }
        );
    },

}

module.exports = dashUsersController