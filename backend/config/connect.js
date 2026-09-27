const mysql = require('mysql2/promise');

// try{
//     const db = mysql.createConnection({
//         host     : 'localhost',
//         user     : 'root',
//         password : '',
//         database : 'db_pesanan'
//     }); 

//     module.exports = db;
// }catch(err){
//     console.log(err);
// }

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_pesanan',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;

