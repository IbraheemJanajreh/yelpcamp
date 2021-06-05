const Review = require('../models/review.js');
const campground = require("../models/campground.js");

module.exports.createReview = async (req, res) => {
    const camp = await campground.findById(req.params.id);
    //console.log(camp);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Successfully Created Comment!');
    res.redirect(`/campgrounds/${req.params.id}`);
}
module.exports.deleteReview = async (req, res) => {
    const {
        id,
        reviewId
    } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await campground.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    });
    req.flash('success', 'Successfully deleted Comment!');
    res.redirect(`/campgrounds/${id}`);
}