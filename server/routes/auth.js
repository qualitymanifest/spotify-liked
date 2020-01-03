const passport = require("passport");

module.exports = app => {
  app.get("/auth/spotify", passport.authenticate("spotify"));

  app.get("/auth/spotify/callback", passport.authenticate("spotify"));
};
