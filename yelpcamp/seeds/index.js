
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')



//Connecting Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log('mongo is connect with express')

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};

const sample = array => array[Math.floor(Math.random() * array.length)];


//Deleting all the campgrounds and Creating 300 new campgrounds
const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const price = Math.floor(Math.random() * 30) + 10;
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '662dd72b180830c3fcaa8058',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)},${sample(places)}`,

            description: ' It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less',
            price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude,
                cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dzd9tetq5/image/upload/v1714728860/o0hp6ucb6teavucprg4z.jpg',
                    filename: 'YelpCamp/uwvvombepmsew16xmyfd',
                },
                {
                    url: 'https://res.cloudinary.com/dzd9tetq5/image/upload/v1714728854/q9izy8ah9knywfvrzduu.jpg',
                    filename: 'YelpCamp/mw9osxkecpbcuymipi5f',
                }
            ],


        })
        await camp.save();
    }
};
seedDb().then(() => {
    mongoose.connection.close()
})