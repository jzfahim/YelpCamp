const { query } = require('express');
const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

//Camprounds Index Page
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', { campgrounds })
};


//Camprounds, Form to Create new Campground Page
module.exports.renderNewForm = (req, res) => {
    res.render('campground/new')
};


//Camprounds, Create new Campground Page
module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();

    if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground)
    req.flash('success', 'Successfully Made a new Campground')
    res.redirect(`/campgrounds/${campground._id}`)
};

////Camprounds, Show Campground Page
module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!campground) {
        req.flash('error', 'Campgorund not found');
        return res.redirect('/campgrounds')
    }
    res.render('campground/show', { campground })
};



//Camprounds, Show Campgrounds Edit Form

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campgorund not found');
        return res.redirect('/campgrounds')
    }
    res.render('campground/edit', { campground })
};


//Camprounds, Update Campground 

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    // const  = await Campground.findById(id);
    // // if (!campground.author.equals(req.user._id)) {
    // //     req.flash('error', 'You do not have the permission');
    // //     return res.redirect(`/campgrounds/${id}`)
    // // }
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs);
    await campground.save();
    req.flash('success', 'Successfully Updated the campgound')
    res.redirect(`/campgrounds/${campground._id}`)

}


//Delete Campground
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted the campground')
    res.redirect('/campgrounds')
}

