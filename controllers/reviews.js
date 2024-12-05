const Listing = require("../models/listing")
const Review = require("../models/review")

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); // Create a new review
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review created");
    res.redirect(`/listings/${listing._id}`);
  };

module.exports.deleteReview = async(req,res) => {
    let {id, reviewid} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}}) //here pull means remove use pdate method and it will delete that reveiw from reviews array from the listing
    await Review.findByIdAndDelete(reviewid); //here we removing the review from the review database
    req.flash("success", "Review Deleted")
    res.redirect(`/listings/${id}`)
  };