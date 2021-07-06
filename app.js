require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt=require("bcrypt")
const saltRounds=10;
const app = express();

app.set("view engine", "ejs");

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.post("/register", function (req, res) {
 
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });
    newUser.save(function (err) {
      if (!err) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
});
 

});

//implementing login page

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if(result===true){
            res.render("secrets")
          }
      });
      }
    }
  });
});

app.listen(8000, function (err) {
  console.log(" The app is ready to start at port 8000");
});
