// Version vieja


const express = require('express');

const router = express.Router();

const pool = require('../../database/db-pool');

const encriptar = require('../../lib/encriptar');



const isLogged = (req,res,next)=>{

    if(req.session.loggedin){
        res.redirect('/list');
        
    }else{       
        return next();
    }

}



router.get('/signup',isLogged,(req,res)=>{
    res.render(req.app.get('pathAuth')+'/signup');

});

router.post('/signup',isLogged,async(req,res)=>{

    const {fullname, username,password} = req.body;

    const validacion = await pool.query(`SELECT * FROM users WHERE username = '${username}'`);
    if(validacion.length>0){
        res.redirect('/signup')
    }else{

        const newPassword = await encriptar.encriptarPassword(password);
        const links = await pool.query(`INSERT INTO users(fullname,username,password) values ('${fullname}','${username}','${newPassword}')`);
        res.redirect('/list');
    }

    
});

router.get('/signin',isLogged,(req,res)=>{

    res.render(req.app.get('pathAuth')+'/signin');

});
 

router.post('/signin',isLogged,async (req,res)=>{

    const {username,password}=req.body;

    const links= await pool.query(`SELECT password FROM users WHERE username = '${username}'`);

    if(links.length>0){
        const validar = await encriptar.comparaPassword(password,links[0].password);
        if(validar){
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/list')
        }else{
            res.redirect('/signin') 
        }    
    }
});

router.get('/logout',async(req,res)=>{

    req.session.loggedin = false;
    req.session.logout;
    res.redirect('/signin');
});
 


module.exports = router;