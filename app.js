
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();
var mailer = require('mailer');

/*mailer.send(
  { host:           "smtp.mandrillapp.com"
  , port:           587
  , to:             "andres_m_@hotmail.com"
  , from:           "test@soccerpicks.com"
  , subject:        "Mandrill knows Javascript!"
  , body:           "Hello from NodeJS!"
  , authentication: "login"
  , username:       "xandrezx@gmail.com"
  , password:       "YK2kZbXNtIK7Mo1o10fDXQ"
  }, function(err, result){
    if(err){
      console.log(err);
    }
  }
);*/

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var users = [
    { id: 1, username: 'a', password: 'a', email: 'andres@example.com' }
  , { id: 2, username: 'Pepe', password: 'birthday', email: 'pepe@example.com' }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  console.log('serializingUser');
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(username, password, done) {
      findByUsername(username, function(err, user) {      	
        if (err) { console.log('error'); return done(err); }
        if (!user) { console.log('no hay usuario'); return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      });
  }
));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/current-fixture', routes.currentFixture);
app.post('/prueba', routes.prueba);

app.get('/login', routes.login);
app.post('/login', function(req, res) {
    console.log(res);
    passport.authenticate('local', function(err, user) {
      if (req.xhr) {
        //thanks @jkevinburton
        if (err)   { return res.json(2); }
        if (!user) { return res.json(1); }
        req.login(user, {}, function(err) {        	
          if (err) { return res.json({error:err}); }
          	app.set('user', user);
			return res.json(3);
        });
      } else {
        if (err)   { return res.redirect('/login'); }
        if (!user) { return res.redirect('/login'); }
        req.login(user, {}, function(err) {
          if (err) { return res.redirect('/login'); }
          return res.redirect('/');
        });
      }
    })(req, res);
  });

app.get('/new-user', routes.newUser);
app.post('/checkEmail', routes.checkEmail);
app.post('/checkUsername', routes.checkUsername);
app.post('/addUser', routes.addUser);

app.get('/new-tournament', routes.newTournament);
app.post('/add-tournament', routes.addTournament);

app.get('/new-members', routes.newMembers);
app.post('/add-members', routes.addMembers);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});