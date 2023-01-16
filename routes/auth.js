const router = require('express').Router();
const UserModel = require('../model/UserModel');
const { registerValidation, loginValidation, flagActiveUserValidation, changePassValidation }= require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyjwt');

router.post('/register', async (req, res) => {
  //JOI validation
  const valid = registerValidation(req.body);
  if(valid.error) return res.status(400).send(valid.error.details[0].message);

  //check if user is in database
  const emailExist = await UserModel.findOne({email: req.body.email});
  if(emailExist) return res.status(400).send("Email already exists");

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //create user
  const user = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
    active:true
  });

  try
  {
    //send the user data to the database
    const savedUser = await user.save();
    res.send(savedUser);
  }
  catch(err)
  {
    res.status(400).send(err.message);
  }
});

//login
router.post('/login', async (req, res) => {
  //JOI validation
  const valid = loginValidation(req.body);
  if(valid.error) return res.status(400).send(valid.error.details[0].message);

  //check if email exists
  const user = await UserModel.findOne({email: req.body.email});
  if(!user) return res.status(400).send("Email doesn't exist.");

  //Password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if(!validPass) return res.status(400).send('Invalid password');

  //If the account isn't activated, let the user know.
  if(!user.active) return res.status(400).send('Account deactivated. Please notify the admin for details.');

  //create and assign a token
  const token = jwt.sign({_id: user._id, email: user.email, name:user.name, account_type:user.account_type}, process.env.SECRET_JWT);
  res.header('auth-jwt', token).send(token);

  //res.send('success!');
});

//Set user as active or not. (ADMIN)
router.put('/:email', verify.admin, async (req,res) => {
  const valid = flagActiveUserValidation(req.body);
  if(valid.error) return res.status(400).send(valid.error.details[0].message);
  const email = req.sanitize(req.params.email);

  //find a user of a given username.
  const founduser = await UserModel.findOne({email:email});
  if(!founduser) return res.status(404).send("Cannot find user with email: " + email);

  try {
    const update = await UserModel.updateOne(
      {email:email},
      {
        $set: {active:req.body.active}
      }
    );
    return res.send({message:"Successfully changed user " + email + " to active:" + req.body.active});
  } catch (e) {
    return res.status(500).send("Could not update review: " + e.message);
  }
});

//Change password
router.put('/', verify.user, async (req,res) => {
  const valid = changePassValidation(req.body);
  if(valid.error) return res.status(400).send(valid.error.details[0].message);
  const email = req.user.email;

  //Make sure old password is correct.
  const user = await UserModel.findOne({email:email});
  if(!user) return res.status(404).send("Your email is incorrect. (Is your token still valid?)");

  const validpass = await bcrypt.compare(req.body.old_password, user.password);
  if(!validpass) return res.status(400).send('Invalid password.');

  try {
    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.new_password, salt);

    const update = await UserModel.updateOne(
      {email:email},
      {
        $set: {password:hashPassword}
      }
    );
    return res.send({message:"Successfully changed " + email + "'s password."});
  } catch (e) {
    return res.status(500).send("Could not update user: " + e.message);
  }
});

//check the user's account type (if they're logged in)
router.get('/', verify.user, async(req,res) => {

  const user = await UserModel.findOne({email:req.user.email});
  if(!user) return res.status(404).send("No user found for given username.");

  return res.send({account_type:user.account_type});
});

module.exports = router;
