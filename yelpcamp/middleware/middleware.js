const { campgroundSchema, reviewSchema } = require('../schemas');
const ExpressError = require('../utilities/expressError')
const Campground = require('../models/campground')
const Review = require('../models/review')


//MiddleWare for Checking IF the client is Logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    }
    next()
};


// MiddleWare for Validating the information that were used to create the Campground
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//MiddleWare for Checking if the current user is the Author of the Campground
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission');
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

//MiddleWare for Checking if the current user is the Author of the Review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission');
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}


//MiddleWare for Validating the information that were used to create the Review
module.exports.validateReviews = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
