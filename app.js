if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// console.log(process.env.CLOUDINARY_SECRET)
// console.log(process.env.CLOUDINARY_KEY)

const express = require('express')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
// const { campgroundSchema, reviewSchema } = require("./Schema.js")
// const catchAsync = require("./utilty/catchAsync")
const ExpressError = require('./utilty/ExpressError')
const methodOverride = require('method-override')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')

const res = require('express/lib/response')

const campgroundRoutes = require('./Routes/campgrounds')
const reviewRoutes = require('./Routes/reviews')
const { date } = require('joi')
const req = require('express/lib/request')
const userRoutes = require('./Routes/Users')

mongoose.connect('mongodb://localhost:27017/yelpcamp')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())

const sessionConfig = {
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  if (!['/login', '/'].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl
  }
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
  res.render('home')
})

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err
  if (!err.message) err.message = 'Oh No, Something went wrong'
  res.status(statusCode).render('errors', { err })
  // res.send("Something went Wrong")
})

app.listen(3000, () => {
  console.log('serving on port 3000')
})
