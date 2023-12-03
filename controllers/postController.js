const connection = require('../db/dbConfig')

//Multer -- Manejo de img's

const postController = {

    publicaciones: (req, res) => {
        const sql = 'SELECT publicaciones.*, Users.name AS usuario, Users.email AS correo FROM publicaciones INNER JOIN Users ON publicaciones.id_usuario = Users.id;';
    
        connection.query(sql, (err, results) => {
            if (err) {
                console.error('Error fetching publicaciones:', err); // Add this line
                res.status(500).send('Fallo al obtener publicaciones');
            } else {
                res.status(200).json(results);
            }
        });
    },

    addPost:  (req, res) => { //requiere la madre esa de la imagen simple
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
      },
    
    addComment: (req, res) => {
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
    }

}

module.exports = postController