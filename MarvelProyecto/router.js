const express = require('express');
const session = require('express-session');
const router = express.Router();
const http = require('http');
const conexion = require('./database/db');

// Configuración de la sesión
router.use(session({
    secret: '123123asdasd123', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

router.get('/',(req,res)=>{

    conexion.query('select * from venta WHERE venta.id = ?', [req.session.idUser], (error, results) => {
        results1 = results;
        conexion.query('select * from relacionVenta', (error, results) => {
            results2 = results;
            conexion.query('SELECT * FROM tipoUsuario', (error, results) => {
                results3 = results;
                res.render('index',{results:results3, sesion: req.session, ventas: results1, relacion: results2});
            });
        });
    });

});

router.get('/usuarios', (req, res) =>{
    conexion.query('SELECT * FROM usuario AS t1 INNER JOIN tipoUsuario as t2 ON t1.idTipUsuario = t2.idTipUsuario',(error, results) => {
        if(error){
            console.log(error);
        }else{
            conexion.query('SELECT * FROM tipoUsuario',(error, tipoUsuario) => {
                if(error){
                    console.log(error);
                }else{
                    res.render('users',{results:results, tipoUsuario:tipoUsuario, sesion: req.session});
                }
            });
        }
    })
});

router.get('/cambiarPasswd', (req, res) =>{
    const id = req.query.id;
    console.log("peticion de correo: " + id);
    res.render('recuperarPsswd',{idUser:id});
});

router.post('/login', (req, res) => {
    const user = req.body.user;
    req.session.user = user;
    res.redirect('/');
});

const crud = require('./controllers/crud');
const { error } = require('console');
router.post('/crearCompra', crud.crearCompra);
router.post('/auth', crud.auth);
router.get('/logout', crud.logout);
router.post('/saveUser',crud.saveUser);
router.post('/editUser',crud.editUser);
router.get('/eliminarUser',crud.eliminarUser);
router.post('/recuperacion',crud.recuperacion);
router.post('/resetPassword',crud.resetPassword);

module.exports = router;