const mongoose = require("mongoose");
const campground = require("../models/campground.js");
const cities = require("./cities.js");
const {
  places,
  descriptors
} = require("./seedHelpers.js");
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
const seedDB = async () => {
  await campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const randomCity = Math.floor(Math.random() * 1000);
    const randomPlace = Math.floor(Math.random() * places.length);
    const randomDescriptors = Math.floor(Math.random() * descriptors.length);
    const camp = new campground({
      geometry: {
        "coordinates": [cities[randomCity].longitude, cities[randomCity].latitude],
        "type": "Point"
      },
      author: '606af72eed76943470346aaa',
      location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
      title: `${descriptors[randomDescriptors]} ${places[randomPlace]}`,
      image: [{
        url: "https://res.cloudinary.com/dzdcl79pn/image/upload/v1618167920/YelpCamp/hthlhig3cnlvrbf9oya6.jpg",
        filename: "YelpCamp/hthlhig3cnlvrbf9oya6"
      }],
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem, vero! Cum magnam molestias natus, eum quam asperiores dolor quae repudiandae expedita neque illum cupiditate, animi iusto quia sed pariatur obcaecati.",
      price: Math.floor(Math.random() * 30) + 10,
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});