create database DevLink;
use DevLink;
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
	description TEXT,
    lat FLOAT,
    lng FLOAT
);


INSERT INTO Users (name, username, email, password, description) VALUES ('Octavio', 'MrDorer', 'dorersempai@gmail.com', 'Patito24','Pio, pio, pio'),
														   ('Gabo', 'DarkShadowXx64', 'Gabo@gmail.com', 'Patito24','Meow, meow, meow'),
                                                           ('Ethan', 'Cana23', 'Ethan@gmail.com', 'Patito24', 'Ladridos, yo que vrga se');

select * from Users;
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

update Users set lng = -86.85026550292969 where id = 1;




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

select * from publicaciones;
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
select * from Users where username = 'dorer';
select * from comentarios;

SELECT * FROM Users WHERE username = "Cana23";

SELECT
    c.id AS comentario_id,
    c.comentario,
    c.img AS comentario_img,
    c.fecha_comentario,
    c.likes_comentarios,
    p.id AS publicacion_id,
    p.titulo,
    p.contenido,
    p.img AS publicacion_img,
    p.fecha_publicacion,
    p.likes_publicacion
FROM
    comentarios c
JOIN
    publicaciones p ON c.id_publicacion = p.id
JOIN
    Users u ON c.id_usuario = u.id
WHERE
    u.username = 'MrDorer';

select * from Users;

SELECT p.* FROM
    publicaciones p
JOIN
    Users u ON p.id_usuario = u.id
WHERE
    u.username = 'MrDorer';

SELECT
    c.id AS comentario_id,
    c.comentario,
    c.img AS comentario_img,
    c.fecha_comentario,
    c.likes_comentarios,
    p.id AS publicacion_id,
    p.titulo AS publicacion_titulo,
    p.contenido AS publicacion_contenido,
    p.img AS publicacion_img,
    p.fecha_publicacion,
    p.likes_publicacion
FROM
    comentarios c
JOIN
    publicaciones p ON c.id_publicacion = p.id
JOIN
    Users u ON c.id_usuario = u.id
WHERE
    u.username = 'MrDorer';


SELECT publicaciones.*, Users.username AS usuario, Users.email AS correo FROM publicaciones INNER JOIN Users ON publicaciones.id_usuario = Users.id;

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