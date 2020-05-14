/** Passport sólo proporciona el mecanismo para manejar la autenticación, 
 * dejando la responsabilidad de implementar la sesión de manipulación 
 *  nosotros mismos y para que vamos a utilizar express-session.  */
//serializar y deserializar la instancia de usuario de un almacén de sesiones para poder dar soporte a las sesiones de inicio de sesión
//npm instal passport passport-local
//https://code.tutsplus.com/es/tutorials/authenticating-nodejs-applications-with-passport--cms-21619

const express = require('express');

const router = express.Router();

const pool = require('../database/db-pool');

const encriptar = require('./encriptar');

const passport = require('passport');

const LocalStrategy=require('passport-local').Strategy;


passport.serializeUser((user,done)=>{
    console.log('pepe gotera');
    console.log(user);
    done(null,user.id);
  });


passport.deserializeUser(async (id, done)=>{
    console.log(' Pepe El bobo');
    const links=await pool.query(`SELECT * FROM users where id=${id}`);
    done(null, links[0]);
});

passport.use('signupLocal',new LocalStrategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true
},async(req,username,password,done)=>{

   // const {fullname, username,password} = req.body;

    const validacion = await pool.query(`SELECT * FROM users WHERE username = '${username}'`);

    if(validacion.length>0){
    
        return done(null,false);

    }else{
        const {fullname} =req.body;
        const newPassword = await encriptar.encriptarPassword(password);
        const links = await pool.query(`INSERT INTO users(fullname,username,password) values ('${fullname}','${username}','${newPassword}')`);

        const id=links.insertId;
        const newUser={
            id, username, password, fullname
        }
        return done(null,links[0]);
    }

}));

passport.use('signinLocal',new LocalStrategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true },async(req,username,password,done)=>{
    
        //const {username,password}=req.body;

        const links= await pool.query(`SELECT * FROM users WHERE username = '${username}'`);
    
        if(links.length>0){
            const validar = await encriptar.comparaPassword(password,links[0].password);
            if(validar){
                req.session.loggedin = true;
                req.session.username = username;      
                
                const {id,fullname} = links[0];

                const newUser={
                    id,username,password,fullname
                }

                return done(null,newUser);
            }else{
                // Solo contempla las clave es incorrecta
                req.session.loggedin=false;
                return done(null,false);
            }    
        }else{
            // Solo contempla los usuarios incorrectos
            return done(null,false);
        }

    }));

module.exports = passport; 

