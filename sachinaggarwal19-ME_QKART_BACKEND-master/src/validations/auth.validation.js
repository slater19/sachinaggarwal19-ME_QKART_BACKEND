const Joi = require("joi");
const { password } = require("./custom.validation");

// TODO: CRIO_TASK_MODULE_AUTH - Define request validation schema for user registration
/**
 * Check request *body* for fields (all are *required*)
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
 * - "name": string
 */
// const register = {
//   body: Joi.object.keys({
//     name:Joi.string().min(2).max(40).required(),
//     password:Joi.string().custom(password,"Register password").required(),
//     email:Joi.string().email().required()}
//     )
// };

const register = {
  body: Joi.object().keys({
    email:Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required()
  })
};

/**
 * Check request *body* for fields (all are *required*)
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
 */
const login = {
  body:Joi.object().keys({
    password:Joi.string().required().custom(password),
    email:Joi.string().email().required()}
    )
};

module.exports = {
  register,
  login,
};
