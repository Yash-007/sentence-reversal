const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");



// register user 
router.post("/register", async(req, res)=>{
    try {
        // if(req.body.password != req.body.confirmpassword){
        //     return res.send({
        //         success: "false",
        //         message: "Password does not match with Confirm Password"
        //     });
        // }
        // check if user already exists 
        const userExits =  await User.findOne({email : req.body.email});
        if(userExits){
           return res.send({
                success: true,
                message: "User already exists",
            });
        }

        // hash password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password= hashedPassword;

        //  save user
        const user = new User(req.body);
        await user.save();

        return res.send({
            success: true,
            message: "User registerd successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
        
    }
});


// login user 
router.post("/login", async(req, res)=>{
    try {
    //   check if user exists   
    const user = await User.findOne({username : req.body.username});
    if(!user){
        return res.send({
            success: false,
            message: "User not founddd"
        });
    }

    // compare password 
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if(!isValid){
        return res.send({
            success: false,
            message: "Incorrct Password",
        })
    }

    // generate token 
    const token = jwt.sign(
      {userId: user._id}, process.env.jwt_secret, {expiresIn: "1d"}
     );
    
     return res.send({
        success: true,
        message: "User logged in successfully",
        data: token,
     });
    }
       catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

router.get("/get-current-user", authMiddleware, async(req,res)=>{
  try {
    const user = await User.findOne({_id: req.body.userId});
    
    // remove password from user 
    user.password = undefined;

    return res.send({
        success: true,
        message: "User fetched successfully",
        data: user,
    })
  } catch (error) {
    return res.send({
        success: false,
        message: error.message,
    })
  }
})


module.exports = router;