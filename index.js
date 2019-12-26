const express = require("express");
const mongoose = require("mongoose");

const keys = require("./config/keys");
mongoose.connect(
	keys.mongoURI,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	err => console.log("Mongoose connected", err)
);
require("./services/passport");
const app = express();
require("./routes/authRoutes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
