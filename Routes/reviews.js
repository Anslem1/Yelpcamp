const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");

const ExpressError = require("../utilty/ExpressError");
const catchAsync = require("../utilty/catchAsync");
const reviews = require("../controllers/reviews");
const {
     isLoggedIn,
     validateReview,
     isReviewAuthor,
     
} = require("../middleware");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
     "/:reviewId",
     isLoggedIn,
     isReviewAuthor,
     catchAsync(reviews.deleteReview)
);

module.exports = router;
