
const express = require('express');

const router = express.Router();

const passport = require('../../lib/passport');

const pool = require('../../database/db-pool');

const encriptar = require('../../lib/encriptar')

const isLogged = (req,res,next)=>{

    if(req.session.loggedin){
        res.redirect('/list');
        
    }else{       
        return next();
    }

}



router.post('/signup',passport.authenticate('signupLocal',{ 
    successRedirect:'/list',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signup',isLogged,(req,res)=>{ 
    res.render(req.app.get('pathAuth')+'/signup');
});


router.get('/signin',isLogged,(req,res)=>{

    res.render(req.app.get('pathAuth')+'/signin');

});
 

router.post('/signin',passport.authenticate('signinLocal',{
    successRedirect:'/list',
    failureRedirect: '/signin',
    failureFlash: true
}));

router.get('/logout',async(req,res)=>{

    req.session.loggedin = false;
    req.session.logout;
    res.redirect('/signin');
});
 


module.exports = router;