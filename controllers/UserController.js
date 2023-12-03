const connection = require('../db/dbConfig')


const UserController = {
    users: (req, res) => {
        const SELECT_ALL_USERS_QUERY = 'SELECT * FROM Users';
    
        connection.query(SELECT_ALL_USERS_QUERY, (err, results) => {
            if (err) {
                res.status(500).send('Error al obtener los usuarios');
            } else {
                res.status(200).json(results); // Enviar la lista de usuarios como respuesta
            }
        });
    },

    ProfileUser: (req, res) => {
        const user = req.params.user
        const sql = 'SELECT * FROM Users WHERE username = ?'
    
        connection.query(sql,user, (err, results) => {
            if (err) {
                res.status(500).send('Fallo al usuario');
            } else {
                res.status(200).json(results);
            }
        });
    },

    PublicationsUser: (req, res) => {
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
    },

    
    CommentsUser: (req, res) => {
        const user = req.params.user;
        const sqlSelect = 'SELECT c.*, u.username AS usuario, u.email AS correo FROM comentarios c INNER JOIN Users u ON c.id_usuario = u.id WHERE u.username = ?';

        connection.query(sqlSelect, user, (err, results) => {
            if (err) {
                res.status(500).send('Fallo al conseguir comentarios');
                console.log(err);
            } else {
                res.status(200).json(results);
                console.log(results);
            }
        });
    },

    //app.get('/comentarios/:user', (req, res) => {
     //   const user = req.params.user
      //  const sql = 'SELECT * from Users where username = ?'
       // console.log(user)                                                     //God know what was this for, shiiiiiit
    
       // connection.query(sql,user, (err, results) => {
       //    if (err) {
        //        res.status(500).send('Fallo al conseguir publicaciones');
       //    } else {
       //         res.status(200).json(results);
        //    }
       // });
    //});



}

module.exports = UserController