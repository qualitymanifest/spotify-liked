const passport = require("passport");

module.exports = app => {
  app.get("/auth/spotify", passport.authenticate("spotify"));

  app.get(
    "/auth/spotify/callback",
    passport.authenticate("spotify"),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.get("/auth/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/auth/current_user", (req, res) => {
    res.send({ displayName: req.user ? req.user.displayName : "" });
  });
};
