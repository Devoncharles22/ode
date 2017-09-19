	const Poem = require('./models/poem');
	const Comment = require('./models/comment');
	const User = require('./models/user');

	module.exports = function(app, passport) {

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}

// normal routes ===============================================================
	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		if (req.isAuthenticated()){
			return res.redirect('/feed');
		}
		res.render('index.ejs');
	});
// FEED SECTION==============
app.get('/feed', isLoggedIn, function(req, res) {
			var author_ids = [];
			var authors = {};
			Poem.find({}).exec().then(function(poems){
				for (var i = 0; i < poems.length; i++) {
					if(author_ids.indexOf(poems[i].author) < 0){
						author_ids.push(poems[i].author);
					}
				}
				return poems;
			}).then(function(poems){
				console.log('----author_ids---',author_ids);
				return User.find({_id: {"$in": author_ids}}).exec().then(function(users){
					for (var i = 0; i < users.length; i++) {
						authors[users[i]._id] = users[i].local.email;
					}
					console.log('----authors----',authors);
					res.render('feed.ejs',{poems:poems,authors:authors});
				});
			});

			// Poem.find({},function(err,poems){
			// 	res.render('feed.ejs',{poems:poems});
			// });
})

	//  POEM SECTION==============
	app.get('/poem/:id', isLoggedIn, function(req,res){
		var author_ids = [];
		var authors = {};
		Poem.findOne({_id:req.params.id},function(err,poem){
			author_ids.push(poem.author);
			Comment.find({poem:req.params.id},function(err,comments){
				for (var i = 0; i < comments.length; i++) {
					if(author_ids.indexOf(comments[i].author) < 0){
						author_ids.push(comments[i].author);
					}
				}
				User.find({_id: {"$in": author_ids}}).exec().then(function(data){
					for (var i = 0; i < data.length; i++) {
						authors[data[i]._id] = data[i].local.email;
					}
					res.render('poem.ejs',{poem:poem, user: req.user, comments: comments,authors:authors});
				});
			});
		});
	});
	app.get('/new-poem', isLoggedIn, function(req, res) {
		res.render('poem-form.ejs',{poem:''});
	});

	app.get('/poem/edit/:id',isLoggedIn,function(req,res){
		Poem.findOne({_id:req.params.id},function(err,poem){
			if(poem.author == req.user._id){
				res.render('poem-form.ejs',{poem:poem});
			} else {
				res.redirect('/poem/'+req.params.id);
			}
		});
	});

	app.post('/poem', isLoggedIn,function(req, res) {
		Poem.create({
			author: req.user._id,
			title: req.body.title,
			content: req.body.content
		},function(err,poem){
				// res.send(poem);
				res.redirect('/profile');
		});
	});

	app.post('/poem-update',isLoggedIn,function(req,res){
		Poem.findOneAndUpdate({_id: req.body._id}, {$set:{title:req.body.title,content:req.body.content}}, {new: true}, function(err, doc){
			if(!err){
				res.redirect('/poem/'+req.body._id);
			}
		});
	});

	app.post('/new-comment', function(req,res){
		Comment.create({
			author: req.user._id,
			content: req.body.comment,
			poem: req.body.poem
		},function(err,comment){
			res.redirect('/poem/'+req.body.poem);
		});
	});

	app.get('/poem/delete/:id', isLoggedIn, function(req, res) {
		Poem.findOne({_id:req.params.id},function(err,poem){
			if(poem.author == req.user._id){
				Poem.findOneAndRemove({_id:req.params.id},function(err,poem){
					if(!err){
						res.redirect('/profile');
					}
				});
			} else {
				res.redirect('/poem/'+req.params.id);
			}
		});
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		Poem.find({author: req.user._id},function(err,poems){
			res.render('profile.ejs', {
				user : req.user,
				poems: poems
			});
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================
	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		});
		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/feed', // redirect to home screen
			failureRedirect : '/login', // redirect back to the sign-in page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('loginMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------
		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/',
				failureRedirect : '/'
			}));

	// twitter --------------------------------
		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));
		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/',
				failureRedirect : '/'
			}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------
		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));
		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/',
				failureRedirect : '/'
			}));

	// twitter --------------------------------
		// send to twitter to do the authentication
		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));
		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});
};
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}