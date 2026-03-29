const Listing = require("../models/listing")


const axios = require("axios");   // ✅ added

const mapToken = process.env.MAP_TOKEN;

module.exports.index=async(req,res)=>{
   const allListings= await Listing.find({});
   res.render("listings/index",{allListings});
};






module.exports.renderNewForm = (req,res)=>{

 
    res.render("listings/new");
}

module.exports.showListing = (async (req, res) => {
   let { id } = req.params;

   const listing = await Listing.findById(id).populate({path:"reviews",populate:{
      path:"author",
   },
}).populate("owner");

   if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");   // ⭐ MUST RETURN
   }
   console.log(listing);


   res.render("listings/show", { listing,mapToken: process.env.MAP_TOKEN });
})

module.exports.createListing = async (req, res, next) => {

  let location = req.body.listing.location;

  const response = await axios.get(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${process.env.MAP_TOKEN}&limit=1`
  );

  const coordinates = response.data.features[0].geometry.coordinates;
  // after the axios call and after you confirmed features exist
const feat = response.data.features[0];

// simple quick log (one-line)
console.log('geometry ->', feat.geometry);

// print center (lng,lat)
console.log('center ->', feat.center);

// pretty / multi-line JSON so it looks exactly like the screenshot
console.log('feature (pretty):\n', JSON.stringify(feat, null, 2));


  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);

  // ✅ Added this only
  newListing.geometry = {
    type: "Point",
    coordinates: coordinates
  };

  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  // newListing.geometry = response.body.features[0].geometry;

  let savedListing =await newListing.save();
  console.log(savedListing);
  // console.log("Coordinates",coordinates);

  req.flash("success", "New listing created");
  res.redirect("/listings");
};


// module.exports.createListing =async(req,res,next)=>{
  


//  let url = req.file.path;
//  let filename = req.file.filename;
//  const newListing=new Listing(req.body.listing)
//   newListing.owner = req.user._id;
//   newListing.image = {url,filename};
//    await newListing.save();
//    req.flash("success","New listing created");
//    res.redirect("/listings");


// };
module.exports.renderEditForm = async(req,res)=>{
     let{id}=req.params;
   const listing= await Listing.findById(id);
   if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");   // ⭐ MUST RETURN
   }
   let originalImageUrl = listing.image.url;
   originalImageUrl=originalImageUrl.replace("/upload","/upload/,w_250");
   res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing = async(req,res)=>{
    
   let{id}= req.params;
   let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file  !== "undefined"){
   let url = req.file.path;
 let filename = req.file.filename;
 listing.image = {url,filename};
 await listing.save();
   }
 
     req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
  let deleteListing= await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success"," listing deleted");
  res.redirect("/listings");
}