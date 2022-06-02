const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
     res.render("users/register");
};

module.exports.register = async (req, res, next) => {
     try {
          const { email, username, password } = req.body;
          const user = new User({ email, username });
          const registeredUser = await User.register(user, password);
          req.login(registeredUser, (err) => {
               if (err) return next(err);
               req.flash("success", "Welcome to Yelpcamp");
               res.redirect("/campgrounds");
          });
     } catch (err) {
          req.flash("error", err.message);
          res.redirect("/register");
     }
     // console.log(registeredUser);
};

module.exports.renderLogin = (req, res) => {
     res.render("users/login");
};

module.exports.loginFlash = (req, res) => {
    req.flash("success", "Welcome,", req.user.username);
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logOut();
    req.flash("success", " You've successfully logged out");
    res.redirect("/campgrounds");
}