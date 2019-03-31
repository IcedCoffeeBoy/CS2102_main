const { Pool } = require('pg');

/* 
If you stuck at connection please ensure that your postreqsql is running 
Run start postreqsql
Ensure that the correct user, host, database, password, port is used  
*/
if (process.env.DATABASE_URL) {
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


// Return a Promise object after a query is made 
pool.db_promise = function (sql, args) {
    return new Promise((resolve, reject) => {
        pool.query(sql, args, (err, data) => {
            if (err) {
                console.log("SQL error:" + err);
                return reject(err);
            } else {
                resolve(data.rows);
            }
        })
    });
}

// Return a true/false promise object to check if sql query return any rows
pool.db_promise_check = function (sql, args) {
    return new Promise((resolve, reject) => {
        pool.query(sql, args, (err, data) => {
            if (err) {
                console.log("SQL error:" + err);
                return reject(err);
            } else {
                if (data.rowCount < 1) {
                    return resolve(false);
                } else {
                    return resolve(true);
                }
            }
        })
    });
}


module.exports = pool;  
