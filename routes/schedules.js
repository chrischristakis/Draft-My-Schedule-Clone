const router = require('express').Router();
const courseData = require('../courseData');
const ScheduleModel = require('../model/ScheduleModel.js');
const UserModel = require('../model/UserModel.js');
const verify = require('./verifyjwt');
const Joi = require('joi');
const fs = require('fs');

let data = {};
courseData.then(promiseResult => data=promiseResult);

//Get all course pairs for a given schedule
router.get('/:sch_name', verify.user, async (req, res) => {
  const schName = req.sanitize(req.params.sch_name).toUpperCase();

  let schedule = await ScheduleModel.findOne({email:req.user.email, sch_name:schName});

  if(!schedule) //schedule was not found
    return res.status(400).send(`Schedule with name ${schName} doesn't exist.`);

  let courses = [];
  for(let i = 0; i < schedule.courses.length; i++)
    courses.push({subject:schedule.courses[i].subject_code, course_code:schedule.courses[i].course_code});

  return res.status(200).send({description:schedule.description, courses:courses})
});

//Get all user schedules names.
router.get('/user/getall', verify.user, async (req, res) => {
  //find all schedules that belong to a user.
  let schedules = await ScheduleModel.find({email:req.user.email}).sort( { last_edited: -1 } );

  if(schedules.length == 0) //schedule was not found
    return res.status(400).send(`You have no schedules. Make one!`);

  let names = [];
  for(let i = 0; i < schedules.length; i++)
    names.push({sch_name:schedules[i].sch_name, last_edited:schedules[i].last_edited, name:schedules[i].name, description:schedules[i].description, numOfCourses:schedules[i].courses.length});

  return res.status(200).send(names)
});

//Get all public schedules given a name.
router.get('/public/:sch_name', async (req, res) => {
  const schName = req.sanitize(req.params.sch_name).toUpperCase();

  let schedule = await ScheduleModel.findOne({public:true, sch_name:schName});

  if(!schedule) //schedule was not found
    return res.status(400).send(`Public schedule with name ${schName} doesn't exist.`);

  let courses = [];
  for(let i = 0; i < schedule.courses.length; i++)
    courses.push({subject:schedule.courses[i].subject_code, course_code:schedule.courses[i].course_code});

  return res.status(200).send({description:schedule.description, courses:courses})
});

//Get names of all public schedules
router.get('/', async (req, res) => {

  //Find all schedules marked as public, and sort them by descending.
  let schedules = await ScheduleModel.find({public:true}).sort( { last_edited: -1 } ).limit(10);

  if(!schedules) //schedule was not found
    return res.status(400).send(`Could not find any public schedules.`);

  let names = [];
  for(let i = 0; i < schedules.length; i++)
    names.push({sch_name:schedules[i].sch_name, last_edited:schedules[i].last_edited, name:schedules[i].name, description:schedules[i].description, numOfCourses:schedules[i].courses.length});

  return res.status(200).send(names)
});

//Create schedule
router.put('/', verify.user, async (req, res) => {
  //validation --------
  const schema = Joi.object({
    name: Joi.string().regex(/^[^*|\":<>[\]{}`\\()';@&$?!]+$/).min(1).max(30).required(), //only a-z, A-Z, 0-9. No spaces allowed either.
    description: Joi.string(),
    public: Joi.boolean()
  });
  const result = schema.validate(req.body);
  if(result.error)
    return res.status(400).send(result.error.details[0].message);
  //-------------------
  const body_name = req.sanitize(req.body.name).toUpperCase(); //sanitize the body
  const description = req.sanitize(req.body.description);

  //Find the data of the user.
  let userdata = await UserModel.findOne({_id:req.user._id});

  //Find if a schedule already exists with a given name.
  let foundSchs = await ScheduleModel.find({email:userdata.email, sch_name:body_name});
  if(foundSchs.length > 0)
    return res.status(400).send("A schedule with that name already exists.");

  //Limit amount of schedules a user can have.
  foundSchs = await ScheduleModel.find({email:userdata.email});
  if(foundSchs.length >= 20)
    return res.status(400).send("You have reached a maximum of 20 schedules already.");


  //Create the db entry
  let schedule_data = new ScheduleModel({
    name:userdata.name,
    email:userdata.email,
    sch_name:body_name,
    description:description,
    public:req.body.public,
    courses: []
  });

  try
  {
    const savedUser = await schedule_data.save();
    res.status(200).send({message:`Schedule with name ${body_name} created.`});
  }
  catch(err)
  {
    res.status(400).send(err.message);
  }
});

//Update schedule with subject/course pairs
router.post('/:sch_name', verify.user, async (req, res) => {
  //validation --------
  const schema = Joi.object({
    subject_code: Joi.string().required(),
    course_code: Joi.string().min(4).max(5).required()
  });
  const result = schema.validate(req.body);
  if(result.error)
    return res.status(400).send(result.error.details[0].message);
  // ------------------

  const body_coursecode = req.sanitize(req.body.course_code).toUpperCase(); //sanitize the body
  const body_subjectcode = req.sanitize(req.body.subject_code).toUpperCase();
  const schName = req.sanitize(req.params.sch_name).toUpperCase();

  //Check if schedule exists
  const findSchs = await ScheduleModel.findOne({email:req.user.email, sch_name:schName});
  if(!findSchs) return res.status(400).send("Can't find schedule with name " + schName);

  //Check if the course actually exists.
  let found = data.find(e =>{
    return e.subject == body_subjectcode && e.catalog_nbr == body_coursecode
  });
  if(!found) return res.status(400).send("Can't find " + body_subjectcode + " " + body_coursecode + " in the database.");

  //Check if course pair already exists in schedule.
  found = findSchs.courses.find(e => e.course_code === body_coursecode && e.subject_code === body_subjectcode);
  if(found) return res.status(400).send(body_subjectcode + " " + body_coursecode + " already exists in this schedule.");

  //update the data.
  const update = await ScheduleModel.updateOne(
    {email: req.user.email, sch_name:schName},
    {
      $set: {last_edited:new Date()},
      $push: { courses: {subject_code:body_subjectcode, course_code:body_coursecode} }
    }
  );

  return res.send({message:("Successfully added " + body_subjectcode + " " + body_coursecode + " to " + schName)});
});

//Update info of a schedule
router.put('/:sch_name', verify.user, async (req, res) => {
  //validation --------
  const schema = Joi.object({
    name: Joi.string().regex(/^[^*|\":<>[\]{}`\\()';@&$?!]+$/).min(1).max(30).required(),
    description: Joi.string(),
    public: Joi.boolean().required()
  });
  const result = schema.validate(req.body);
  if(result.error)
    return res.status(400).send(result.error.details[0].message);
  // ------------------

  let newSchName = req.sanitize(req.body.name);
  const description = req.sanitize(req.body.description);
  const oldSchName = req.sanitize(req.params.sch_name).toUpperCase();
  const public = req.body.public;

  if(newSchName) newSchName = newSchName.toUpperCase(); //make sure we're not calling to uppercase on null.
  if(!newSchName && !description) return res.status(400).send("No arguments passed to update.");

  //make sure schedule exists.
  const found = await ScheduleModel.findOne(
    {email: req.user.email, sch_name:oldSchName}
  );
  if(!found) return res.status(404).send("Cannot find schedule " + oldSchName);

  const update = await ScheduleModel.updateOne(
    {email: req.user.email, sch_name:oldSchName},
    {
      //Dont update properties that are null in user input.
      $set: {sch_name:(newSchName)?newSchName:found.sch_name, description:(description)?description:found.description, last_edited:new Date(), public:public}
    }
  );

  return res.status(200).send({message:"Successfully updated " + oldSchName});
});

//Delete a course off of a schedule
router.delete('/:sch_name/:subject_code/:course_code', verify.user, async (req, res) => {
  const schName = req.sanitize(req.params.sch_name).toUpperCase();
  const subject = req.sanitize(req.params.subject_code).toUpperCase();
  const course_code = req.sanitize(req.params.course_code).toUpperCase();

  let foundCourse = await ScheduleModel.findOne({email:req.user.email, sch_name:schName, courses:{$elemMatch: { subject_code:subject, course_code:course_code }} });
  if(!foundCourse) return res.status(400).send("Could not find " + subject + " " + course_code + " in " + schName);

  try{
    let deletion = await ScheduleModel.update(
      {email:req.user.email, sch_name:schName},
      {$pull: { courses: {subject_code:subject, course_code:course_code}} }
    );
    return res.status(200).send({message:"Successfully removed from schedule."});
  } catch(err) {
    return res.status(500).send("Could not alter schedule.");
  }
});


//Delete a schedule
router.delete('/:sch_name', verify.user, async (req, res) => {
  const schName = req.sanitize(req.params.sch_name).toUpperCase();

  try{
    let deletion = await ScheduleModel.deleteOne({email:req.user.email, sch_name:schName});
    if(deletion.n == 0) return res.status(400).send("No schedules with name " + schName + " found.");
    return res.status(200).send({message:"Successfully deleted schedule."});
  } catch(err) {
    return res.status(500).send("Could not delete schedule.");
  }
});

module.exports = router;
