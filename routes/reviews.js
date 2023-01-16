const router = require('express').Router();
const verify = require('./verifyjwt');
const ReviewModel = require('../model/ReviewModel.js');
const courseData = require('../courseData');
const { reviewValidation, flagReviewValidation } = require('../validation');
const mongoose = require('mongoose');

//load course data from JSON
let data = {};
courseData.then(promiseResult => data=promiseResult);

//Post a review
router.post('/', verify.user, async (req,res) => {
  const valid = reviewValidation(req.body);
  if(valid.error) return res.status(400).send(valid.error.details[0].message);
  const course_code = req.sanitize(req.body.course_code).toUpperCase();
  const subject_code = req.sanitize(req.body.subject_code).toUpperCase();
  const text = req.sanitize(req.body.text);
  const rating = req.body.rating;
  const name = req.user.name;
  const email = req.user.email;

  //Make sure course actually exists.
  let found = data.find(e =>{
    return e.subject == subject_code && e.catalog_nbr == course_code
  });
  if(!found) return res.status(400).send("Can't find " + body_subjectcode + " " + body_coursecode + " in the database.");

  //Create the db entry
  let review = new ReviewModel({
    subject_code:subject_code,
    course_code:course_code,
    text:text,
    rating: rating,
    date_posted: new Date(),
    email:email,
    name:name
  });

  //Save it to mongo
  try
  {
    const savedUser = await review.save();
    res.status(200).send({message:`Review posted.`});
  }
  catch(err)
  {
    res.status(400).send(err.message);
  }
});

//Find reviews for a course.
router.get('/:subject_code/:course_code', async (req,res) => {
  const subject_code = req.sanitize(req.params.subject_code).toUpperCase();
  const course_code = req.sanitize(req.params.course_code).toUpperCase();

  //Get all reviews for a course
  const foundRevs = await ReviewModel.find({subject_code:subject_code, course_code:course_code});
  if(foundRevs.length === 0 || !foundRevs) return res.status(408).send("Cannot find reviews for course " + subject_code + " " + course_code);

  //Create an array of reviews
  let reviews = [];
  for(let i = 0; i < foundRevs.length; i++)
    if(!foundRevs[i].hidden) //don't show hidden reviews.
      reviews.push({_id:foundRevs[i]._id, name:foundRevs[i].name, email:foundRevs[i].email, rating:foundRevs[i].rating, text:foundRevs[i].text, date_posted:foundRevs[i].date_posted, subject:subject_code, course_code:course_code});

  return res.send(reviews);
});

//get all hidden reviews. (ADMIN)
router.get('/hidden', verify.admin, async (req,res) => {

  //Get all reviews for a course
  const foundRevs = await ReviewModel.find({hidden:true});
  if(foundRevs.length === 0 || !foundRevs) return res.status(408).send("Cannot find any hidden reviews.");

  //Create an array of reviews
  let reviews = [];
  for(let i = 0; i < foundRevs.length; i++)
      reviews.push({_id:foundRevs[i]._id, name:foundRevs[i].name, email:foundRevs[i].email, rating:foundRevs[i].rating, text:foundRevs[i].text, date_posted:foundRevs[i].date_posted, subject:foundRevs[i].subject_code, course_code:foundRevs[i].course_code});

  return res.send(reviews);
});

//mark a review as hidden or not hidden (ADMIN)
router.put('/:review_id', verify.admin, async (req,res) => {
  const valid = flagReviewValidation(req.body);
  if(valid.error) return res.status(400).send(valid.error.details[0].message);
  const review_id = req.sanitize(req.params.review_id);

  //find a review with the given id
  const foundRev = await ReviewModel.findOne({_id:mongoose.Types.ObjectId(review_id)});
  if(!foundRev) return res.status(404).send("Cannot find review with id: " + review_id);

  try {
    const update = await ReviewModel.updateOne(
      {_id:mongoose.Types.ObjectId(review_id)},
      {
        $set: {hidden:req.body.hidden}
      }
    );
    return res.send({message:"Successfully changed review with id " + review_id + " to hidden:" + req.body.hidden});
  } catch (e) {
    return res.status(500).send("Could not update review: " + e.message);
  }
});

module.exports = router;
