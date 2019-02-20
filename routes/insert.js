var express = require('express');
var router = express.Router();
var db = require('../db');

/* SQL Query */
var sql_query = 'INSERT INTO student_info VALUES';

// GET
router.get('/', function(req, res, next) {
	res.render('insert', { title: 'Modifying Database' });
});

// POST
router.post('/', function(req, res, next) {
	// Retrieve Information
	var matric  = req.body.matric;
	var name    = req.body.name;
	var faculty = req.body.faculty;
	
	// Construct Specific SQL Query
	var insert_query = sql_query + "('" + matric + "','" + name + "','" + faculty + "')";
	
	db.query(insert_query, (err, data) => {
		res.redirect('/select')
	});
});

module.exports = router;
