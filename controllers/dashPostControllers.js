const connection = require('../db/dbConfig')
const dashPostControllers = {

    getPost: (req, res) => {
        const postId = req.params.id;
        const SELECT_PUBLICACION_BY_ID_QUERY = `
            SELECT * FROM publicaciones WHERE id = ?
        `;
    
        connection.query(SELECT_PUBLICACION_BY_ID_QUERY, [postId], (err, results) => {
            if (err) {
                console.error('Error fetching publicacion by id:', err);
                res.status(500).send('Fallo al obtener la publicación');
            } else {
                if (results.length > 0) {
                    res.status(200).json(results[0]); // Enviar la publicación encontrada como respuesta
                } else {
                    res.status(404).send('Publicación no encontrada');
                }
            }
        });
    },
    
    
    // editar
    updatePost: (req, res) => {
        const postId = req.params.id;
        const { titulo, contenido, img, likes_publicacion } = req.body;
        const UPDATE_PUBLICACION_QUERY = 'UPDATE publicaciones SET titulo=?, contenido=?, img=?, likes_publicacion=? WHERE id=?';
    
        connection.query(
            UPDATE_PUBLICACION_QUERY,
            [titulo, contenido, img, likes_publicacion, postId],
            (err, results) => {
                if (err) {
                    res.status(500).send('Error al editar la publicación');
                } else {
                    res.status(200).send('Publicación editada con éxito');
                }
            }
        );
    },
    // eliminar
    deletePost: (req, res) => {
        const postId = req.params.id;
        const DELETE_PUBLICACION_QUERY = 'DELETE FROM publicaciones WHERE id = ?';
    
        connection.query(DELETE_PUBLICACION_QUERY, [postId], (err, results) => {
            if (err) {
                res.status(500).send('Error al eliminar la publicación');
            } else {
                res.status(200).send('Publicación eliminada con éxito');
            }
        });
    },
    
    getComments: (req, res) => {
        const SELECT_ALL_COMMENTS_QUERY = `
            SELECT * FROM comentarios;
        `;
    
        connection.query(SELECT_ALL_COMMENTS_QUERY, (err, results) => {
            if (err) {
                console.error('Error fetching comments:', err);
                res.status(500).send('Fallo al obtener comentarios');
            } else {
                res.status(200).json(results);
            }
        });
    },
    
    
    // get un comentario
    
    getComment: (req, res) => {
        const comentarioId = req.params.id;
        const SELECT_COMMENT_BY_ID_QUERY = `
            SELECT * FROM comentarios
            WHERE id = ?;
        `;
    
        connection.query(SELECT_COMMENT_BY_ID_QUERY, [comentarioId], (err, results) => {
            if (err) {
                console.error('Error fetching comment by id:', err);
                res.status(500).send('Fallo al obtener el comentario');
            } else {
                if (results.length > 0) {
                    res.status(200).json(results[0]); // Enviar el comentario encontrado como respuesta
                } else {
                    res.status(404).send('Comentario no encontrado');
                }
            }
        });
    },
    
    // editar
    updateComment: (req, res) => {
        const comentarioId = req.params.id;
        const { comentario, img, likes_comentarios } = req.body;
        const UPDATE_COMENTARIO_QUERY = 'UPDATE comentarios SET comentario=?, img=?, likes_comentarios=? WHERE id=?';
    
        connection.query(
            UPDATE_COMENTARIO_QUERY,
            [comentario, img, likes_comentarios, comentarioId],
            (err, results) => {
                if (err) {
                    res.status(500).send('Error al editar el comentario');
                } else {
                    res.status(200).send('Comentario editado con éxito');
                }
            }
        );
    },
    // eliminar
    deleteComment: (req, res) => {
        const comentarioId = req.params.id;
        const DELETE_COMENTARIO_QUERY = 'DELETE FROM comentarios WHERE id = ?';
    
        connection.query(DELETE_COMENTARIO_QUERY, [comentarioId], (err, results) => {
            if (err) {
                res.status(500).send('Error al eliminar el comentario');
            } else {
                res.status(200).send('Comentario eliminado con éxito');
            }
        });
    }

}

module.exports = dashPostControllers