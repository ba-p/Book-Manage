require('dotenv').config();
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var multer = require("multer");
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

var upload = multer({ dest: "./public/uploads/" });

var userRouter = require("./routes/users.route");
var bookRouter = require("./routes/books.route");
var tranRouter = require("./routes/transactions.route");
var authRouter = require("./routes/auth.route");
var proRouter = require("./routes/pro.route");
var authLogin = require("./middleware/auth.validate");



app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser(process.env.SECRET_COOKIE));
app.use(express.static("public"));


app.use("/users", authLogin.authLogin, userRouter);
app.use("/books", authLogin.authLogin, bookRouter);
app.use("/transactions", authLogin.authLogin, tranRouter);
app.use("/auth", authRouter);
app.use("/profile",proRouter);

app.get("/", authLogin.authLogin, (req, res) => {
  res.render("index", {
    id: req.signedCookies.userId
  });
});

const listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + 3000);
});
