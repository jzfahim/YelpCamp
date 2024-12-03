const express = require('express')
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground')
const Review = require('../models/review');

const { reviewSchema } = require('../schemas')
const { validateReviews, isLoggedIn, isReviewAuthor } = require('../middleware/middleware')
const ExpressError = require('../utilities/expressError');
const catchAsync = require('../utilities/catchAsync');
const reviews = require('../controllers/reviews')


//Review Routers
router.post('/', isLoggedIn, validateReviews, catchAsync(reviews.createReview))
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;