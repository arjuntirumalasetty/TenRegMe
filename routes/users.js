var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	User.getAllStadiumNames({},function(err,user) {
		console.log(user);
		// body...
	})
	res.render('login');
});

// home
router.get('/home', function(req, res){
	res.render('home');
});



// Register User
router.post('/register', function(req, res){
	var stadiumName = req.body.stadiumName;
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('stadiumName','Stadium Name is required').notEmpty();
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			stadiumName : stadiumName,
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);

		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

router.post('/partReg', function(req, res){
	var participantName = req.body.participantName;
	var gender = req.body.gender;
	var DateOfBirth = req.body.DateOfBirth;
	var address = req.body.address;
	var institute = req.body.institute;
	var parentName = req.body.parentName;
	var backgroundInTennis = req.body.backgroundInTennis;
	var PhoneNo = req.body.PhoneNo;
	var email = req.body.email;
	var medHistory = req.body.medHistory;

	// Validation
	req.checkBody('participantName', 'Name is required').notEmpty();
	req.checkBody('gender', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);

		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});


passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/users/home', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/home');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;