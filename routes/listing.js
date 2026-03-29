const express = require("express");
const router = express.Router();


const Listing = require("../models/listing");          // ⭐ model
const wrapAsync = require("../utils/wrapAsync");       // ⭐ async wrapper
// const { listingSchema } = require("../schema");        // ⭐ Joi schema
// const ExpressError = require("../utils/ExpressError"); // ⭐ custom error
const {isLoggedIn,isOwner,validateListing}= require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const{storage}=require("../cloudConfig.js")
const upload = multer({ storage })






router.route("/")
.get(wrapAsync(listingController.index))
 .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing))
// .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));




//new route
router.get("/new",isLoggedIn,listingController.renderNewForm );


router.route("/:id")
.get( wrapAsync(listingController.showListing ))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));









//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));






module.exports= router;


