const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  subject_code: {type:String, required:true},
  course_code: {type:String, required:true},
  text: {type:String, max: 300},
  rating: {type:Number, min: 1, max: 5, required: true},
  date_posted: {type:Date, default:Date.now},
  name: {type:String, required:true},
  email: {type:String, required:true},
  hidden: {type:Boolean, default:false}
});

module.exports = mongoose.model('Review', reviewSchema);
