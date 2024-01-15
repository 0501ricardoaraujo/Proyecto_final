const mysql = require('mysql')

const conexion = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'marvelTienda'
});

conexion.connect((error) => {
    if(error){
        console.log("Error de conexion: " + error);
        return
    }
    console.log('Conexion exitosa');
});

module.exports = conexion;