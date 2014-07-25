var mysql = require('mysql');

exports.conexion = function(){
	return mysql.createConnection({
		user: 'root',
		password: 'admin',
		host: 'localhost',
		port: 3306,
		database: 'SoccerPicks'});
};