var express = require('express');
var router = express.Router();

const { Pool } = require('pg');


/* 
If you stuck at connection please ensure that your postreqsql is running 
Run start postreqsql
Ensure that the correct user, host, database, password, port is used  
*/
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  //password: '********', My postregsql doesn't use any password
  port: 5432,
});

/* SQL Query */
var sql_query = 'SELECT * FROM student_info';

router.get('/', function (req, res, next) {
  pool.query(sql_query, (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(data);
      res.render('select', { title: 'Database Connect', data: data.rows });
    }

  });
});

module.exports = router;
