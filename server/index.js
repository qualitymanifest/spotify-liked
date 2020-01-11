const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");

const keys = require("./config/keys");
require("./models/User");
require("./models/UserArtist");
require("./services/passport");
mongoose.connect(
  keys.mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  err => console.log("Mongoose connected", err)
);
const app = express();
app.enable("trust proxy");
app.use((req, res, next) => {
  if (req.secure || process.env.NODE_ENV !== "production") {
    return next();
  }
  res.redirect(`https://${req.hostname}${req.url}`);
});
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  if (req.path.startsWith("/api") && !req.isAuthenticated()) {
    res.status(401).send(`Route ${req.path} requires authentication`);
  } else {
    return next();
  }
});
require("./routes/auth")(app);
require("./routes/api")(app);

if (process.env.NODE_ENV === "production") {
  // Serve prod assets like main.js and main.css
  app.use(express.static("../client/build"));
  // Serve index.html if route is not recognized
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
