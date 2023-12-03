const connection = require('../db/dbConfig')
const bcrypt = require('bcrypt');

const editPerdilControllers = {

    linkGithub: (req, res) => {                     ///add/github/:id  Permite "linkear" una cuenta de github, pero no esta terminado del todo
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
    },

    editImg: (req, res) => {                         ///  Permite agregar una foto por el mismo usuario **En teoria**
        try {
    
          const userId = req.body.id_usuario;
          const imagePath = req.file.path; 
      
      
          const sql ='UPDATE Users SET img = ? WHERE id = ?;';
          const values = [ imagePath, userId ];
      
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
      },

      editarEmail: (req, res) => { //  
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
    },

    editPassword: async (req, res) => { // 
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
    },

    editDescription: (req, res) => { // 
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
    },

    editLocation: (req, res) => {               //
        console.log(req.body.coordinates)
        const data = req.body.coordinates
        const id = req.params.id
    
        console.log(id)
    
        sql = 'UPDATE Users SET lat = ?, lng = ? WHERE id = ?;'
        values = [data.lat, data.lng, id]
    
        connection.query(sql,values, (err, results) => {
            if (err) {
                res.status(500).send('Fallo al cambiar coordenadas');
                console.log(err)
            } else {
                res.status(200).send('coordenadas cambiadas exitosamente');
                console.log('Registrado en: ', data)
            }
        })
    },

    deleteUser: (req, res) => {            // 
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
    },


    
}



module.exports = editPerdilControllers