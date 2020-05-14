// const path=require('path');
//path.join(__dirname,'directori')

const express = require('express');

const router = express.Router();

const pool = require('../../database/db-pool');

const isLogged = (req,res,next)=>{

    if(req.session.loggedin){
        return next();
    }else{
        res.redirect('/signin');
    }

}


router.get('/',(req,res)=>{
    res.send('Hola Don Pepito');
});


router.get('/list', isLogged ,async(req,res)=>{
        const links=await pool.query('SELECT * FROM employees1');  

        links.username = req.session.username;
        res.render(req.app.get('pathLinks') + '/list',{links,mensaje: req.flash('signupMessage')});    
 });
 
router.get('/add', isLogged ,async(req,res) =>{
    const links = {username: req.session.username};
    res.render(req.app.get('pathLinks')+'/add',{links}) 
})

router.post('/add', isLogged ,async(req,res)=>{

    const {nombre,salario} = req.body;
    await pool.query(`INSERT INTO employees1(nombre,salario) values('${nombre}','${salario}')`);
    res.redirect('list');
});

router.get('/delete/:id',isLogged ,async(req,res)=>{
    const {id} = req.params;
    await pool.query(`DELETE FROM employees1 WHERE id=${id}`);
    res.redirect('/list');
})


router.get('/edit/:id',isLogged ,async(req,res)=>{
    const {id} = req.params;
    const query = `SELECT * FROM employees1 where id =${id}`
    const links = await pool.query(query);
    console.log(links);

    links[0].username = req.session.username;
    res.render(req.app.get('pathLinks')+'/edit',{links:links[0]});
})

router.post('/edit/:id',isLogged ,async(req,res)=>{
    const {id} = req.params;
    const {nombre,salario} = req.body;
    const query = `update employees1 set nombre='${nombre}', salario=${salario} where id = ${id}`
    await pool.query(query);


    res.redirect('/list');
})


module.exports = router;