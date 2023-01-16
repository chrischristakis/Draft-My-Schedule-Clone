const router = require('express').Router();
const courseData = require('../courseData');

let data = {};
courseData.then(promiseResult => data=promiseResult);

//Get all subjects and their descriptions
router.get('/', (req, res) => {
  let subjects = data.map(function(n) { //Put all subjects and descriptions into an array of objects.
    return {subject:n.subject, desc:n.className};
  });
  res.send(subjects);
});

//get all course codes given a subject code
router.get('/:subject_code', (req, res) => {
  const subject_code = req.sanitize(req.params.subject_code); //sanitize

  let codes = data
  .filter(function(n) { //get all objects of a given subject name
    return (n.subject).toUpperCase() === (subject_code).toUpperCase();
  })
  .map(function(n) { //return course code for each of the selected subjects
    return n.catalog_nbr;
  });

  if(codes.length > 0)
    res.send(codes);
  else
    res.status(404).send(`Course code \'${subject_code}\' not found.`);
});

//Find timetable given a subject code and a course code
router.get('/:subject_code/:course_code', (req, res) => {
  const courseCode = req.sanitize(req.params.course_code).toUpperCase().trim();
  const subjectCode = req.sanitize(req.params.subject_code).toUpperCase().trim();

  let course = data.filter(function(n) { //Find course that matches subject name and course code
    return ((n.subject).toUpperCase() === subjectCode
         && (n.catalog_nbr+"").startsWith(courseCode));
  })
  .map(function(n) {
    let arr = [];
    for(let i = 0; i < n.course_info.length; i++) //Loop through each course component, like LEC or LAB
    {
      const e = n.course_info[i];
      arr.push({class_section:e.class_section, start_time:e.start_time,
        end_time:e.end_time, facility_ID:e.facility_ID, campus:e.campus, days:e.days, ssr_component:e.ssr_component});
    }
    return {subject:subjectCode, course_code:n.catalog_nbr, className:n.className, component_info:arr};
  });

  if(course.length > 0)
    res.send(course);
  else
    res.status(404).send(`Could not find time table for \'${subjectCode} ${courseCode}\'.`);
});

//Same as above, but if a component is specified
router.get('/:subject_code/:course_code/:course_component', (req, res) => {
  const courseCode = req.sanitize(req.params.course_code).toUpperCase();
  const subjectCode = req.sanitize(req.params.subject_code).toUpperCase();
  const courseComp = req.sanitize(req.params.course_component).toUpperCase();

  let notFound = false;
  let courses = data.filter(function(n) { //Find courses that matches subject name and course code
    return ((n.subject).toUpperCase() === subjectCode
         && (n.catalog_nbr+"").startsWith(courseCode)
         && (n.course_info[0].ssr_component) === courseComp);
  }).
  map(function(n) {
    let e = n.course_info[0];
    return {
      course_code:n.catalog_nbr,
      component_info:[{class_section:e.class_section, start_time:e.start_time, end_time:e.end_time,
        facility_ID:e.facility_ID, campus:e.campus, days:e.days, ssr_component:e.ssr_component}]
      };
  });

  if(courses.length > 0)
    res.send(courses);
  else
    res.status(404).send(`Could not find time table for \'${subjectCode} ${courseCode}\' with component \'${courseComp}\'.`);
});

module.exports = router;
