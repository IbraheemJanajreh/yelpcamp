const mongoose = require('mongoose');
const opts = { toJSON: { virtuals: true } };
const Review = require('./review')
const Schema = mongoose.Schema;
const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
    title: String,
    image: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
},opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong><p>${this.description.substring(0,25)}...</p>`;
});
CampgroundSchema.post('findOneAndDelete', async function (camp) {
    if (camp) {
        await Review.remove({
            _id: {
                $in: camp.reviews
            }
        })
    }
})
module.exports = mongoose.model('Campground', CampgroundSchema);