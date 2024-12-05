const passport = require("passport");
const LocalStrategy = require("passport-local");
const Listing = require("./models/listing");
const Review = require("./models/review");

// Middleware to check if the user is logged in
const isLogedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Save the redirect URL in the session
        req.flash("error", "You must be logged in to create a new listing");
        return res.redirect("/login"); // Redirect to the login page
    }
    next(); // Proceed to the next middleware if authenticated
};

// Middleware to save redirect URL
const savedRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Save redirect URL to res.locals
    }
    next(); // Proceed to the next middleware
};

// Middleware to check ownership
const isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing || !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to edit this listing");
        return res.redirect(`/listings/${id}`);
    }
    next(); // Proceed if owner matches
};

const isreviewAuthor = async (req, res, next) => {
    let { id, reviewid } = req.params;
    let review = await Review.findById(reviewid);
    if (!review|| !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You did not create this review");
        return res.redirect(`/listings/${id}`);
    }
    next(); // Proceed if owner matches
};



// Export all functions in a single object
module.exports = { isLogedIn, savedRedirectUrl, isOwner, isreviewAuthor };
