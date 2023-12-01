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


UPDATE Users SET username = 'elizabeth@yahoo.com' WHERE id = 9;

DELETE FROM Users WHERE id = 1;

