const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utilty/catchAsync");
const passport = require("passport");
const currentUser = require("../app.js");
const users = require("../controllers/users");

router
     .route("/register")
     .get(users.renderRegister)
     .post(catchAsync(users.register));

router
     .route("/login")
     .get(users.renderLogin)
     .post(
          passport.authenticate("local", {
               failureFlash: true,
               failureRedirect: "/login",
          }),
          users.loginFlash
     );

router.get("/logout", users.logout);

module.exports = router;
