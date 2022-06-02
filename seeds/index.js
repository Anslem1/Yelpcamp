
const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedhelpers')
const Campground = require('../models/campground')


mongoose.connect('mongodb://localhost:27017/yelpcamp')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 50 ; i++) {
    const rando1k = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 20) + 10
    const camp = new Campground({
      author: '628fafd0311cc8e18db2220e',
      location: `${cities[rando1k].city}, ${cities[rando1k].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      price,
      geoLocation: {
        type: 'Point',
        coordinates: [cities[rando1k].longitude, cities[rando1k].latitude]
      },
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, fuga tenetur unde aspernatur eius quidem iste ratione nulla libero dicta quo distinctio fugiat deserunt cum ex natus ipsam quas aperiam?',
      image: [
        {
          url:
            'https://res.cloudinary.com/dnu01soaq/image/upload/v1653868368/Yelp-Camp/jy702g1lel3gl0qfqv5i.png',
          filename: 'Yelp-Camp/jy702g1lel3gl0qfqv5i'
        }
      ]
    })

    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
