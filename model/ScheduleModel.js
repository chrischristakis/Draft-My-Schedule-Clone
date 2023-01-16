const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  name:
  {
    type: String,
    required: true,
    max: 255,
    min: 6
  },
  email:
  {
    type: String,
    required: true,
    max: 255,
    min: 6
  },
  sch_name:
  {
    type:String,
    max: 30,
    min:1,
    required:true
  },
  description:
  {
    type:String,
    default:'My schedule'
  },
  public:
  {
    type:Boolean,
    default: false
  },
  last_edited:
  {
    type:Date,
    default:Date.now
  },
  courses:
  [{
    course_code: {type:String},
    subject_code: {type:String}
  }]
});

module.exports = mongoose.model('Schedule', scheduleSchema);
