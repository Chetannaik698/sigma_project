const Listing = require("../models/listing.js")

//index route logic // made index named function and it will be called in routes
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new");
}

module.exports.showListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
                select: "username", // Nested populate to show the author's username in reviews
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res) => {
    let url = req.file.path
    let filename = req.file.filename
    const { title, description, price, country, location, image } = req.body;
    const createdListing = new Listing({
        title:title,
        description:description,
        price:price,
        country:country,
        location:location,
        image: {
           url: url,
           filename: filename
        },
        owner: req.user._id,
    });
    await createdListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}

module.exports.rendereditform = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    let orginalImageurl = listing.image.url;
    orginalImageurl = orginalImageurl.replace("/uploads", "/upload/h_300, w_250")

    res.render("listings/edit", { listing, orginalImageurl });
}

module.exports.updateListing = async (req, res) => {
    let listing = await Listing.findByIdAndUpdate(req.params.id, req.body);
    if(typeof req.file !== "undefined"){
        let url = req.file.path
        let filename = req.file.filename
        listing.image = {url, filename}
        await listing.save()
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};