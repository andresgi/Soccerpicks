
/*
 * GET home page.
 */
var cnx = require('../mod/bd').conexion;
var mailer = require('mailer');

/*exports.helloworld = function(req, res){
  res.render('helloworld', { title: 'Hello, World!' });
};*/

exports.currentFixture = function(req, res){
  var objConexion = new cnx;
  objConexion.query('SELECT idMatch, T1.idTeam AS idLocal, T1.Name AS Local, T2.idTeam AS idVisitor, T2.Name AS Visitor FROM soccerpicks.match, soccerpicks.team AS T1, soccerpicks.team AS T2 WHERE soccerpicks.match.LocalTeam = T1.idTeam AND soccerpicks.match.VisitorTeam = T2.idTeam', function(error, resultados){
    objConexion.end();
    console.log(resultados);    
    res.render('current-fixture', { matches: resultados, user: req.app.get('user') })
  });
};

exports.prueba = function(req, res){
	var objConexion = new cnx;	
	var user = req.app.get('user');
	console.log(req.body);	
	for (var idMatch in req.body) {
	  objConexion.query('INSERT INTO UserFixture (idUser, idMatch, userSelection) VALUES (' + objConexion.escape(user.id) + ', ' + objConexion.escape(idMatch) + ', ' + objConexion.escape(req.body[idMatch]) + ')');
	}
	objConexion.end();
	res.render('login');
};

exports.login = function(req, res){	
	res.render('login');
};

exports.newUser = function(req, res){	
	res.render('new-user');
};

exports.checkEmail = function(req, res){		
	var objConexion = new cnx;		
	objConexion.query('SELECT idUser FROM User WHERE email = ' + objConexion.escape(req.body.email), function(error, resultados){
    	objConexion.end();
    	console.log(resultados);
    	if(resultados.length != 0){    		
    		return res.json(false);
    	}    
    	else{
    		return res.json(true);
    	}    	
  	});	
};

exports.checkUsername = function(req, res){		
	var objConexion = new cnx;		
	objConexion.query('SELECT idUser FROM User WHERE username = ' + objConexion.escape(req.body.username), function(error, resultados){
    	objConexion.end();
    	console.log(resultados);
    	if(resultados.length != 0){    		
    		return res.json(false);
    	}    
    	else{
    		return res.json(true);
    	}    	
  	});	
};

exports.addUser = function(req, res){	
	var objConexion = new cnx;	
	objConexion.query('INSERT INTO User (username, password, email) VALUES (' + objConexion.escape(req.body.username) + ', ' + objConexion.escape(req.body.password) + ', ' + objConexion.escape(req.body.email) + ')');
	objConexion.end();
	return res.json(3);
};

exports.newTournament = function(req, res){	
	res.render('new-tournament');
};

exports.addTournament = function(req, res){	
	res.redirect('/new-members');
};

exports.newMembers = function(req, res){	
	res.render('new-members');
};

exports.addMembers = function(req, res){		
	for (var i = 1; i<=req.body.mailsCounter; i++) {
		mailer.send({
			host:           "smtp.mandrillapp.com",
			port:           587,
			to:             "andres_m_@hotmail.com",
			from:           "test@soccerpicks.com",
			subject:        "Correo de prueba",
			body:           "Hello World!",
			authentication: "login",
			username:       req.body.email[i],
			password:       "YK2kZbXNtIK7Mo1o10fDXQ"
		  	},
		  	function(err, result){
			    if(err){
			      console.log(err);
			    }
			}
		);
	}
	res.redirect('/login');
};