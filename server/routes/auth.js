const passport = require("passport");

module.exports = app => {
  app.get("/auth/spotify", passport.authenticate("spotify"));

  app.get("/auth/spotify/callback", passport.authenticate("spotify"));

  app.get("/auth/logout", (req, res) => {
    req.logout();
    res.send(req.user);
  });

  app.get("/auth/current_user", (req, res) => {
    res.send(req.user ? req.user.displayName : {});
  });
};
