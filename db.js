const { Pool } = require('pg');

/* 
If you stuck at connection please ensure that your postreqsql is running 
Run start postreqsql
Ensure that the correct user, host, database, password, port is used  
*/

// if (process.env.DATABASE_URL) {
if (false) {
    const connectionString = process.env.DATABASE_URL;
    var pool = new Pool({
        connectionString: connectionString,
    });
} else {
    var pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        port: 5432,
    });
}

pool.connect(function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Sucessfully connected to database");
    }
});

module.exports = pool;  
