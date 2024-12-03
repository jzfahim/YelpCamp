const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const { string, number } = require('joi');

const opts = { toJSON: { virtuals: true } }


//Cammpground Schema
const campgroundSchema = new Schema({
    title: String,
    images: [{
        url: String,
        filename: String
    }],
    price: Number,
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
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId, ref: 'Review'
    }]
}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>
<P>${this.description.substring(0, 20)}...</p>`
})

//Deleting the reviews Associated with the Campground that was deleted
campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema)