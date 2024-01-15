const express = require('express');
const app = express();

const port = 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:false}));
app.use(express(express.json));

app.use('/',require('./router'));

app.listen(port, ()=> {
  console.log('SERVER corriendo en http://localhost:${port}');
});