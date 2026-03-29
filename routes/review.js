const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync"); 
const ExpressError = require("../utils/ExpressError");
// const {reviewSchema } = require("../schema");
const Review =require("../models/review.js");
const Listing = require("../models/listing");
const {validateReview, isLoggedIn,isReviewAuthor,} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js");

// const validateReview = (req,res,next)=>{
//  let {error}=  reviewSchema.validate(req.body);
  
//    if(error){
//     let errMsg = error.details.map((el)=> el.message).join(",");
//     throw new ExpressError(400,errMsg);
//    }
//    else{
//     next();
//    }
// };
//reviews
//post rote
router.post("/",isLoggedIn, validateReview,wrapAsync(reviewController.createReview));
//delete review royre
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview)
)
module.exports = router;
