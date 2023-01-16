const Joi = require('joi');

//register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required()
  });

  return schema.validate(data);
}

const reviewValidation = (data) => {
  const schema = Joi.object({
    subject_code:Joi.string().required(),
    course_code:Joi.string().required(),
    text:Joi.string().max(300),
    rating: Joi.number().min(1).max(5).required()
  });

  return schema.validate(data);
}

const flagReviewValidation = (data) => {
  const schema = Joi.object({
    hidden:Joi.boolean().required()
  });

  return schema.validate(data);
}

const flagActiveUserValidation = (data) => {
  const schema = Joi.object({
    active:Joi.boolean().required()
  });

  return schema.validate(data);
}

const changePassValidation = (data) => {
  const schema = Joi.object({
    old_password:Joi.string().required(),
    new_password:Joi.string().required().min(5)
  });

  return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.reviewValidation = reviewValidation;
module.exports.flagReviewValidation = flagReviewValidation;
module.exports.flagActiveUserValidation = flagActiveUserValidation;
module.exports.changePassValidation = changePassValidation;
