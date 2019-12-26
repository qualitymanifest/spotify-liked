const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");

const keys = require("./config/keys");
require("./models/User");
require("./services/passport");
mongoose.connect(
  keys.mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => console.log("Mongoose connected", err)
);
const app = express();
app.use((req, res, next) => {
  if (req.secure || req.hostname === "localhost") {
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
require("./routes/authRoutes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
