const session = require('express-session');
const conexion = require('../database/db');
//Importando la biblioteca nodemailer en tu archivo
const nodemailer = require("nodemailer");

exports.auth = (req, res) => {
	let user = req.body.user;
	let password = req.body.password;

    conexion.query('SELECT * FROM usuario WHERE nombreUsuario = ? AND psswd = ?', [user,password], (err, results) => {
        if(results.length > 0) {
            console.log(results);
            req.session.loggedin = true;
            req.session.name = user;
            req.session.idUser = results[0].id;
            req.session.tipoUser = results[0].idTipUsuario;
            res.redirect('/');
        } else {
            res.redirect('/');
        }
      
    });
}

exports.resetPassword = (req, res) => {
	const id = req.query.id;
    let password = req.body.password;

    conexion.query('UPDATE usuario SET psswd = ? WHERE id = ?',[password,id], (error, results) => {
        if(error){
            console.log(error);
        }else{
            res.redirect('/');
        }
    });
}

exports.recuperacion = (req, res) => {
    const email = req.body.mail;

    conexion.query('SELECT * FROM usuario WHERE email = ?',[email], (error, results) => {
        if(error){
            console.log(error);
        }else{
            if(results.length > 0){
                // Configuración del servicio de correo electrónico
                const transporter = nodemailer.createTransport({
                    /**
                     * Para utilizar otro servicio de correo electrónico, como Yahoo o Outlook, debes
                     * cambiar el valor de la propiedad service y ajustar la configuración de autenticación correspondiente.
                     */
                    service: "gmail",
                    auth: {
                        user: "0501araujo@gmail.com",
                        pass: "bnwjhbjvgwwatfta",  
                    },
                });
            
                // Definir el contenido del cuepro para el correo electrónico que deseas enviar
                const mailOptions = {
                    from: "0501araujo@gmail.com",
                    to: email,
                    subject: "Recuperación de contraseña TIENDA MARVEL",
                    html: `
                    <h1>Hola, ${results[0].nombreUsuario}</h1>
                    <hr>
                    Este correo fue enviado para hacer una recuperación de contraseña, si no fuiste tu
                    ignora este correo, de lo contrario haz click en el siguiente enlace.
                    <hr>
                    <a href="http://localhost:3000/cambiarPasswd?id=${results[0].id}">Haz click aquí para recuperar tu contraseña</a>
                    `,
                };
            
                // Envía el correo electrónico utilizando el método sendMail del objeto transporter
                transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Correo electrónico enviado: " + info.response);
                }
                });
            }
            res.redirect('/');
        }
    });

}

exports.eliminarUser = (req, res) => {
	const id = req.query.id;
    
    conexion.query('DELETE FROM usuario WHERE id = ?',[id], (error, results) => {
        if(error){
            console.log(error);
        }else{
            res.redirect('/usuarios');
        }
    });
    
}

exports.crearCompra = (req, res) => {
	let data = '';

    // Recibir datos del cuerpo de la solicitud
    req.on('data', chunk => {
      data += chunk;
    });

    // Procesar datos cuando se completa la recepción
    req.on('end', () => {
      try {
        // Convertir la cadena JSON a un objeto JavaScript
        const receivedData = JSON.parse(data);
        
        conexion.query('INSERT INTO venta SET ?',{id_ven:null,id:req.session.idUser});
        var idVenta;
        conexion.query('SELECT MAX(id_ven) AS idVen FROM venta WHERE id = ?',[req.session.idUser], (error, results) => {
            if(error){
                console.log(error);
            }else{
                for(var i = 0; i < receivedData.length; i++){
                    conexion.query('INSERT INTO relacionVenta SET ?',{idRel:null,id_ven:results[0].idVen,codigo:receivedData[i].codigo});
                }
            }
        });

        // Enviar una respuesta al cliente
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Datos recibidos correctamente' }));

      } catch (error) {

        console.error('Error al analizar JSON:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al analizar JSON' }));
      }
    });
}

exports.logout = (req, res) => {
    if (req.session.loggedin) {
      req.session.destroy();
    }
    res.redirect('/');
}

exports.saveUser = (req, res) => {
    const user = req.body.user;
    const email = req.body.email;

    // Validar nombre de usuario
    conexion.query('SELECT * FROM usuario WHERE nombreUsuario = ?', [user], (errorUser, resultsUser) => {
        if (errorUser) {
            console.log(errorUser);
        } else {
            if (resultsUser.length === 0) {
                // Si el nombre de usuario no existe, validar correo electrónico
                conexion.query('SELECT * FROM usuario WHERE email = ?', [email], (errorEmail, resultsEmail) => {
                    if (errorEmail) {
                        console.log(errorEmail);
                    } else {
                        if (resultsEmail.length === 0) {
                            // Si tanto el nombre de usuario como el correo electrónico son únicos, proceder con la inserción
                            const tipoUsuario = req.body.tipoUsuario;
                            const nombre = req.body.nombre;
                            const apellido = req.body.apellido;
                            const telefono = req.body.telefono;
                            const password = req.body.password;

                            conexion.query('INSERT INTO usuario SET ?', {
                                id: null,
                                idTipUsuario: tipoUsuario,
                                nombres: nombre,
                                apellidos: apellido,
                                email: email,
                                nombreUsuario: user,
                                psswd: password,
                                phone: telefono
                            }, (errorInsert, resultsInsert) => {
                                if (errorInsert) {
                                    console.log(errorInsert);
                                } else {
                                    req.session.user = user;
                                    res.redirect('/');
                                }
                            });
                        } else {
                            console.log("El correo electrónico ya está registrado");
                            res.redirect('/');
                        }
                    }
                });
            } else {
                console.log("El usuario ya existe!");
                res.redirect('/');
            }
        }
    });
};

exports.editUser = (req, res) => {
    const id = req.query.id;
    const user = req.body.user;
    const email = req.body.email;
    const tipoUsuario = req.body.tipoUsuario;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const telefono = req.body.telefono;
    const password = req.body.password;

    conexion.query('UPDATE usuario SET ? WHERE id = ?',[{idTipUsuario:tipoUsuario,nombres:nombre,apellidos:apellido,email:email,nombreUsuario:user,psswd:password,phone:telefono},id], (error, results) => {
        if(error){
            console.log(error);
        }else{
            if(user == req.session.name){
                req.session.name = user;
                req.session.tipoUser = tipoUsuario;
            }
            res.redirect('/usuarios');
        }
    });
   
}