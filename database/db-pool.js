const mysql = require('mysql');

//permite convertir código de callback a código de promesas
const {promisify}=require('util');

const {database} = require('./database.js');

const pool = mysql.createPool(database);

pool.getConnection((err,conn)=>{
    if(conn && !err){
        conn.release();
        console.log('Todo Correcto en Pool');
        return;
    }else{
        if(err){
            if (err.code==='ER_CON_COUNT_ERROR'){
                console.error('Muchas conexiones en la bd');
            }
            if(err.code=== 'PROTOCOL_CONNECTION_LOST'){
                console.error('La conexión está cerrada');
             
            }
            if(err.code=='ECONNREFUSED'){
                console.error('Conexión rechazada');
            }
    } 
}
});

//cada vez que quiera hacer una consulta
//puedo usar promesas
// J nos lo tiene que explicar después 

pool.query=promisify(pool.query);

module.exports = pool;