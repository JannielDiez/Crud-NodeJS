const express = require('express');
const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');
const flash = require('connect-flash');



const {database}=require('./database/database.js');
app.set('port',process.env.port || 8000);


//PATH 
app.set('pathLinks',`${__dirname}/src/views/links`);
app.set('pathAuth',`${__dirname}/src/views/auth`);
app.use(express.urlencoded());

const exphbs=require('express-handlebars');


app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: ('./src/views/main'),
    partialsDir:('./src/views/main/partials'),
    extname: '.hbs'
}));


app.use(session({
 secret: 'secret',
 resave: true,
 saveUninitialized: true,
 store:new MySQLStore(database)
}));

//para usar nuestro motor 
app.set('view engine','.hbs');
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(require('./src/routes/routes'));
app.use(require('./src/routes/auth'));
app.use(flash());



//esto es para aceptar los datos que vienen de un formulario
//app.use(express.urlencoded({extended:false}));

app.listen(app.get('port'),()=>{
    console.log("Todo correcto en el puerto",app.get('port'));
});