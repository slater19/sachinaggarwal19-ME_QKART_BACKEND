const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const authController = require("../../controllers/auth.controller");

const router = express.Router();

// TODO: CRIO_TASK_MODULE_AUTH - Implement "/v1/auth/register" and "/v1/auth/login" routes with request validation





// const {userValidationSchema}=require('../validations/user.validator');
// const {validateSchema}=require('../middlewares/validate');
// const {postSignup,postLogin }=require('../controllers/auth.controller.js');
// const {loginBodyValidationSchema}=require('../validations/auth.validator');

// const validateUser=validateSchema(userValidationSchema)
// const validateLoginBody =validateSchema(loginBodyValidationSchema)



// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).


// POST request for creating Book.
router.post("/register",validate(authValidation.register),authController.register);
router.post("/login",validate(authValidation.login) ,authController.login);

module.exports = router;



