const jwt = require('jsonwebtoken');

//Middleware function
module.exports.user = function (req,res,next) {
  const token = req.header('auth-jwt');
  //Make sure header has an access token
  if(!token) return res.status(401).send('Token header missing, access denied.');

  try
  {
    const verified = jwt.verify(token, process.env.SECRET_JWT);
    req.user = verified; //contains the body of the jwt
    next(); //run the next part of the router
  }
  catch(err)
  {
    res.status(400).send('Invalid Token');
  }
}

//Admin authorization
module.exports.admin = function (req,res,next) {
  const token = req.header('auth-jwt');
  //Make sure header has an access token
  if(!token) return res.status(401).send('Token header missing, access denied.');

  try
  {
    const verified = jwt.verify(token, process.env.SECRET_JWT);
    if(verified.account_type !== "admin")
      return res.status(400).send('You are not an authorized admin, invalid token');
    req.user = verified; //contains the body of the jwt
    next(); //run the next part of the router
  }
  catch(err)
  {
    res.status(400).send('Invalid Token');
  }
}
