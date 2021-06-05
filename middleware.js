const campground = require("./models/campground.js");
const ExpressError = require("./utils/ExpressError");
const Review = require('./models/review.js');
const {
    campgroundSchema,
    reviewSchema
} = require('./schemas.js');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        req.flash('error', 'You must signed in first!');
        return res.redirect('/login');
    }
    next();
}
module.exports.validateCampground = (req, res, next) => {
    const {
        error
    } = campgroundSchema.validate(req.body);
    //console.log(result.error.details[0]);
    if (error) {
        const msgs = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msgs, 400);
    } else {
        next();
    }
};
module.exports.isAuthor = async (req, res, next) => {
    const {
        id
    } = req.params;
    const campgroundID = await campground.findById(id);
    if (!campgroundID.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const {
        id,
        reviewId
    } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.validateReview = (req, res, next) => {
    const {
        error
    } = reviewSchema.validate(req.body);
    //console.log(reviewSchema.validate(req.body));
    if (error) {
        const msgs = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msgs, 400);
    } else {
        next();
    }
}