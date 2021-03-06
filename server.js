var express = require('express'),
	uaParser = require('ua-parser'),

	app = express();

// For the JS/CSS resources
app.use('/static', express.static(__dirname + '/web'));

function hasNoPushStateSupport(req) {
	var ua = uaParser.parseUA(req.headers['user-agent']),
		family = ua.family.toLowerCase(),
		majorVer = parseInt(ua.major, 10);

	// TODO: IE < 10, iOS < 5, Android < 4.2 // See http://caniuse.com/#feat=history
	return (family === 'ie' && majorVer < 10);
}

// Map any path through to the client to be processed by the Y.App.
app.get('/*', function(req, res) {

	if (req.path.length > 1 && hasNoPushStateSupport(req)) {
		// Rewrite the path to be hash-based if we detect a full path on a browser that doesn't support HTML5 pushState
		res.redirect('/#' + req.path);
		return;
	}

	res.header('X-UA-Compatible', 'IE=edge');
	res.sendfile('web/index.html');
});

app.listen(8000);
