const express = require("express")
const mongoose = require("mongoose");
const path = require("path")
const cities = require("./cities")
const {places, descriptors} = require("./seedhelpers")
const Campground = require("../models/campground");
const { title } = require("process");


mongoose.connect("mongodb://localhost:27017/yelpcamp");

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]


const seedDB = async () => {
    await Campground.deleteMany({})
  for(let i = 0; i < 50; i++){
      const rando1k =  Math.floor(Math.random() * 1000)
      const price = Math.floor(Math.random() * 20) + 10; 
    const camp =  new Campground({
         location: `${cities[rando1k].city}, ${cities[rando1k].state}` ,
         title: `${sample(descriptors)} ${sample(places)}`,
         image: "https://picsum.photos/350/300?random=1",
         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, fuga tenetur unde aspernatur eius quidem iste ratione nulla libero dicta quo distinctio fugiat deserunt cum ex natus ipsam quas aperiam?",
         
      })

      await camp.save()
  }
}

seedDB().then(()=>{
    mongoose.connection.close()
})