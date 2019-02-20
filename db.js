const { Pool } = require('pg');

/* 
If you stuck at connection please ensure that your postreqsql is running 
Run start postreqsql
Ensure that the correct user, host, database, password, port is used  
*/
const pool = new Pool({
    user: 'ckdtnpmamiywyi',
    host: 'ec2-54-204-2-25.compute-1.amazonaws.com',
    database: 'dd15caf96d7vac',
    password: '7eb2c774f7473c16e33e941002cbfcecfa94845782aaeb770001f79459e25cee',
    port: 5432,
});

/* const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    //password: '********', My postregsql doesn't use any password
    port: 5432,
}); */

pool.connect(function (err) {
    if (err) {
       console.log(err)
    }
    else {
        console.log("Sucessfully connected to database");
    }
});

module.exports = pool;  
