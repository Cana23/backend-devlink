const connection = require('../db/dbConfig')

const likesController = {

    like: (req, res) => {
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
    },

    likesPost: (req, res) => {
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
    }

}

module.exports = likesController