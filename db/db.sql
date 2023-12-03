create database DevLink;
USE DevLink;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
	description TEXT,
    lat FLOAT,
    lng FLOAT,
    img VARCHAR(200)
);

CREATE TABLE publicaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    contenido TEXT,
    img VARCHAR(80),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes_publicacion INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE comentarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    comentario TEXT,
    img VARCHAR(80),
    fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes_comentarios INT NOT NULL DEFAULT 0,
    id_usuario INT NOT NULL,
    id_publicacion INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id) ON DELETE CASCADE
);

CREATE TABLE me_gusta (
    id_like INT PRIMARY KEY AUTO_INCREMENT,
    id_publicacion INT NOT NULL,
    id_usuario INT NOT NULL,
    id_comentario INT,
    fecha_like DATETIME NOT NULL,
    FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id),
    FOREIGN KEY (id_comentario) REFERENCES comentarios(id),
    FOREIGN KEY (id_usuario) REFERENCES Users(id)
);

CREATE TABLE seguir (
    id_seguir INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario_seguidor INT NOT NULL,
    id_usuario_seguido INT NOT NULL,
    fecha_seguimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario_seguidor) REFERENCES Users(id),
    FOREIGN KEY (id_usuario_seguido) REFERENCES Users(id)
);

UPDATE Users SET username = 'elizabeth@yahoo.com' WHERE id = 9;

DELETE FROM Users WHERE id = 1;

<<<<<<< HEAD
SELECT p.*, u.username AS usuario, u.email AS correo FROM publicaciones p INNER JOIN Users u ON p.id_usuario = u.id WHERE u.username = 'MrDorer';
SELECT c.*, u.username AS usuario, u.email AS correo FROM comentarios c INNER JOIN Users u ON c.id_usuario = u.id WHERE u.username =  'MrDorer';

CREATE TABLE me_gusta (
    id_like INT PRIMARY KEY AUTO_INCREMENT,
    id_publicacion INT NOT NULL,
    id_usuario INT NOT NULL,
    id_comentario INT,
    fecha_like DATETIME NOT NULL,
    FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id),
    FOREIGN KEY (id_comentario) REFERENCES comentarios(id),
    FOREIGN KEY (id_usuario) REFERENCES Users(id)
);

select * from me_gusta;
=======
>>>>>>> b82e69d30b8344d7ab537ec2bd619aeb0be3a19b
