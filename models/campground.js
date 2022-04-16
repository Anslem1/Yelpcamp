//const { type } = require("express/lib/response");
const { types, ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: {
        type: Schema.Types.ObjectId,
        ref: "Reviews"
    }
   
})

module.exports = mongoose.model("campground", CampgroundSchema)