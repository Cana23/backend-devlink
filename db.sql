create database DevLink;
USE DevLink;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
);

INSERT INTO Users (name, username, email, password) VALUES ('Octavio', 'dorer', 'dorersempai@gmail.com', 'Patito'),
														   ('Gabo', 'darkshadow', 'Gabo@gmail.com', 'Patito'),
                                                           ('Ethan', 'Cana23', 'Ethan@gmail.com', 'Patito');

CREATE TABLE publicaciones (
	id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    contenido TEXT,
    img VARCHAR(80),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes_publicacion INT NOT NULL,
    id_usuario INT NOT NULL,
           FOREIGN KEY (id_usuario) REFERENCES Users(id)
);

INSERT INTO publicaciones(titulo,contenido,likes_publicacion,id_Usuario,img) VALUES ('Valores de teste', 'Contenido de tsteo papito',0,1,'https://i.pinimg.com/736x/aa/62/d3/aa62d34b2fb002fd55be6c080520998d.jpg');
SELECT * FROM publicaciones ;


SELECT * FROM comentarios;

CREATE TABLE comentarios (
	id INT PRIMARY KEY AUTO_INCREMENT,
    comentario TEXT,
    img VARCHAR(80),
    fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes_comentarios INT NOT NULL DEFAULT 0, 
		id_usuario INT NOT NULL,
        id_publicacion INT NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES Users(id),
        FOREIGN KEY (id_publicacion) REFERENCES publicaciones(id)
    );
    
SELECT publicaciones.*, Users.name AS nombre_usuario FROM publicaciones INNER JOIN Users ON publicaciones.id_usuario = Users.id;

SELECT publicaciones.*, Users.name AS usuario, Users.email AS correo FROM publicaciones INNER JOIN Users ON publicaciones.id_usuario = Users.id;

 
    
select * from Users


