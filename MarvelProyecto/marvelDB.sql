drop database marvelTienda;
create database marvelTienda;
use marvelTienda;

CREATE TABLE tipoUsuario(
idTipUsuario INT AUTO_INCREMENT PRIMARY KEY,
tipoUsuario VARCHAR(100) NOT NULL
);INSERT INTO tipoUsuario VALUES(1,'Administrador'),(2,'Comprador');

CREATE TABLE usuario(
id INT AUTO_INCREMENT PRIMARY KEY,
idTipUsuario INT,
nombres VARCHAR(50),
apellidos VARCHAR(50),
email VARCHAR(100),
nombreUsuario VARCHAR(50),
psswd VARCHAR(255),
phone VARCHAR(20),
CONSTRAINT FOREIGN KEY (idTipUsuario) REFERENCES tipoUsuario(idTipUsuario) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE venta(
id_ven INT AUTO_INCREMENT PRIMARY KEY,
id INT NOT NULL,
fecha datetime default CURRENT_TIMESTAMP
);

CREATE TABLE relacionVenta(
idRel INT AUTO_INCREMENT PRIMARY KEY,
id_ven INT NOT NULL,
codigo VARCHAR(255) NOT NULL
);