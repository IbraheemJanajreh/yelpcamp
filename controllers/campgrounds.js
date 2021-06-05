const campground = require("../models/campground.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({
    accessToken: mapBoxToken
});
const {
    cloudinary
} = require("../cloudinary");
module.exports.index = async (req, res) => {
    const campgrounds = await campground.find({});
    res.render("campgrounds/index", {
        campgrounds,
    });
}
module.exports.renderNewForm = async (req, res) => {

    res.render("campgrounds/new");
}
module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();

    const newCampground = req.body;
    //console.log(req.body);
    newCampground.author = req.user._id;
    //const idd = await campground.insertMany(newCampground);
    const camp = new campground({
        title: newCampground.title,
        location: newCampground.location,
        description: newCampground.description,
        price: newCampground.price,
        image: req.files.map(f => ({
            url: f.path,
            filename: f.filename
        })),
        author: newCampground.author,
        geometry: geoData.body.features[0].geometry
    });

    // console.log(newCampground);
    await camp.save();
    //console.log(camp);
    req.flash('success', 'Successfully Added Campground!');
    res.redirect(`/campgrounds/${camp._id}`);
}
module.exports.showCampground = async (req, res) => {
    const {
        id
    } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        req.flash('error', 'Cannot find that Campground!');
        return res.redirect('/campgrounds');
    }
    const campgroundID = await campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campgroundID) {
        req.flash('error', 'Cannot find that Campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", {
        campground: campgroundID,
    });
}
module.exports.renderEditFrom = async (req, res) => {
    const {
        id
    } = req.params;
    const campgroundID = await campground.findById(id);
    if (!campgroundID) {
        req.flash('error', 'Cannot find that Campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit", {
        campground: campgroundID,
    });
}
module.exports.updateCampground = async (req, res) => {
    const {
        id
    } = req.params;
    //console.log(req.body);
    const camp = await campground.findByIdAndUpdate(id, req.body);
    const imgs = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    camp.image.push(...imgs);
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({
            $pull: {
                image: {
                    filename: {
                        $in: req.body.deleteImages
                    }
                }
            }
        })
        console.log(camp);
    }
    req.flash('success', 'Successfully Edited Campground!');
    res.redirect(`/campgrounds/${id}`);
}
module.exports.deleteCampground = async (req, res) => {
    const {
        id
    } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Campground!');
    res.redirect("/campgrounds");
}