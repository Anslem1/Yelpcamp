const { campgroundSchema, reviewSchema } = require('./Schema.js')
const ExpressError = require('./utilty/ExpressError')
const Campground = require('./models/campground')
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) => {
  req.session.returnTo = req.originalUrl
  if (!req.isAuthenticated()) {
    req.flash('error', "Oops, looks like you aren't sign in")
    return res.redirect('/login')
  }
  next()
}

module.exports.validateCampground = (req, res, next) => {

 
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    console.log(error)
    throw new ExpressError(msg, 404)
  } else next()
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  if (!campground.author.equals(req.user.id)) {
    req.flash('error', 'You do not own this campground')
    res.redirect(`/campgrounds/${id}`)
  }
  next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params
  const review = await Review.findById(reviewId)
  if (!review.author.equals(req.user.id)) {
    req.flash('error', 'You do not own this review')
    res.redirect(`/campgrounds/${id}`)
  }
  next()
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 404)
  } else {
    next()
  }
}
