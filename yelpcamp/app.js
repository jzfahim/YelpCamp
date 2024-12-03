
require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utilities/expressError');
const { campgroundSchema, reviewSchema } = require('./schemas');
const campgrounds = require('./Routes/campground');
const reviews = require('./Routes/reviews');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./Routes/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp';
const MongoDbStore = require('connect-mongo')(session);



app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const store = new MongoDbStore({
    url: dbUrl,
    secret: 'thisisasecret',
    touchAfter: 24 * 3600
})

store.on("error", function (e) {
    // console.log("Session Store Error", e)
})
const sessionConfig = {
    store,
    name: 'blah',
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {

        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));


//Middlewares
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Flash
app.use((req, res, next) => {
    // console.log(req.query)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// 'mongodb://127.0.0.1:27017/yelp-camp'

mongoose.connect(dbUrl);
// main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
    // console.log('mongo is connect with express')


};




/////engine and path

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
});

/////Api Router
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)
app.use('/', userRoutes)


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

//Error
app.use((err, req, res, next) => {
    const { status = 404, message = 'Something went wrong' } = err;
    if (!err.message) err.message = 'oh No something wrong'
    res.status(status).render('error', { err });

})

app.listen(3000, () => {
    // console.log('started the yelpcamp server')
})