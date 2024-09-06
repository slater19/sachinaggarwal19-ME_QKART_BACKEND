const httpStatus = require("http-status");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");

/**
 * Login with username and password
 * - Utilize userService method to fetch user object corresponding to the email provided
 * - Use the User schema's "isPasswordMatch" method to check if input password matches the one user registered with (i.e, hash stored in MongoDB)
 * - If user doesn't exist or incorrect password,
 * throw an ApiError with "401 Unauthorized" status code and message, "Incorrect email or password"
 * - Else, return the user object
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  
    
  const user = await userService.getUserByEmail(email)
  if(!user || !(await user.isPasswordMatch(password)))
  {
    throw new ApiError(httpStatus.UNAUTHORIZED,"Incorrect Credentials")
  }
  // return {_id:user._id,walletMoney:parseInt(user.walletMoney),name:user.name,email:user.email,password:user.password,address:user.address};
  return user

}  
  
    
 
    




module.exports = {
  loginUserWithEmailAndPassword,
};


// signup =async (user) => {
//   try {
//     const hashedPassword = await this.encryptPassword(user.password);
    
//     const result = await userServiceInstance.register({...user,
//       password:hashedPassword}
//       )
//     return result
//    } catch (error) {
//     throw error
 
//   } 
      
//     }
//     VerifyPasswords=async  (username,password) =>{
//       try {
      
      
//         const usersResult = await userServiceInstance.findByUsername(username)
//         const isValid = await bcrypt.compare(password, user.password)
//         if(isValid)return user
//         else return null
//        } catch (error) {
//         throw error
     
//   };}

//    generateToken =  (username) => {
//     try {
//       const payload = {username} 
//       const options = {expiresIn:'1h'} 
//       const secret =process.env.SECRET_KEY 
//       const token = jwt.sign(payload,secret,options); // generate a random token string using the uuid library

//       return token;
//     } catch (error) {
      
//       throw error
//     }
//   };

  
//   login =async (user) => {
//     try {
//       const {username,password} = user
//       const userdata =await this.VerifyPasswords(username,password) 
//       if(userdata){
//         const token =await this.generateToken(userdata.username) 
//       return {isLoggenIn:true,token:token}}else{
//         return
//         {isLoggenIn:false}
        
//       }
//      } catch (error) {
//       throw error
// }}
// }
