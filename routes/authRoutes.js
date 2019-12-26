const passport = require("passport");

module.exports = app => {
	app.get("/auth/spotify", passport.authenticate("spotify"));

	app.get("/auth/spotify/callback", passport.authenticate("spotify"));

	app.get("/api/current_user", (req, res) => {
		// Make sure passport & cookie-session middleware is working
		res.send(req.user);
	});
};
