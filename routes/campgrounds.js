const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const campgrounds = require("../controllers/campgrounds.js");
const multer = require('multer');
const {
    storage
} = require('../cloudinary/index.js'); // /index.js auto
const upload = multer({
    storage
});
const {
    isLoggedIn,
    validateCampground,
    isAuthor
} = require('../middleware.js');
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
router.get("/new", isLoggedIn, catchAsync(campgrounds.renderNewForm));
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,  upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditFrom));

module.exports = router;