const router = require('express').Router();
const verify = require('./verifyjwt');
const UserModel = require('../model/UserModel.js');

//Add another admin
router.put('/:email', verify.admin, async (req,res) => {
  const email = req.sanitize(req.params.email);

  //Make sure user exists.
  const user = await UserModel.findOne({email:email});
  if(!user) return res.status(400).send("No user with email " + email + " exists.")

  try {
    const updated = await UserModel.updateOne(
      {email:email},
      {
        $set: {account_type:"admin"}
      }
    );
    return res.send({message:email + " has been promoted to admin"});
  } catch (e) {
    return res.status(500).send("Could not update user: " + e.message);
  }
});

module.exports = router;
