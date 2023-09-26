const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require('../models/userModel');
const jwt = require("jsonwebtoken");
const authMiddlewares = require("../middlewares/authMiddlewares");
const Inventory = require('../models/inventoryModel');
const mongoose =require("mongoose");

// register user 
router.post("/register", async (req, res) => {
    try {
        // check if user already exists 
        const userExits = await User.findOne({ email: req.body.email });
        if (userExits) {
            return res.send({
                success: false,
                message: "User already exists",
            })
        }

        // hash password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        // save user 
        const user = new User(req.body);
        await user.save();

        return res.send({
            success: true,
            message: 'User registered successfully',
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        })
    }
})

// login user 
router.post("/login", async (req, res) => {
    try {
        // check if user exists 
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.send({
                success: false,
                message: "User not found",
            })
        }

        if(user.userType!== req.body.userType){
           return res.send({
            success: false,
            message: `User is not registered as ${req.body.userType} `
           });
        }

        //    compare password 
        const isvalid = await bcrypt.compare(req.body.password, user.password);
        if (!isvalid) {
            return res.send({
                success: false,
                message: "Invalid password",
            });
        }

        // generate token 
        const token = jwt.sign(
            { userId: user._id }, process.env.jwt_secret, { expiresIn: '1d' }
        );

        return res.send({
            success: true,
            message: "User logged in successfully",
            data: token,
        });

    } catch (error) {
        return res.send({
            success: true,
            message: error.message,
        });
    }
})


// get current user 
router.get("/get-current-user",authMiddlewares, async (req,res)=>{
    try{
    const user= await User.findOne({_id: req.body.userId});

    // remove password from user object 
    user.password= undefined;
    return res.send({
        success: true,
        message: "User fetched successfully",
        data: user,
    })
    } catch(error){
        return res.send({
            success: false,
            message: error.message,
        });
    }
})

// get all unique donars 
router.get("/get-all-donars", authMiddlewares, async(req,res)=>{
    try {
        // get all unique donor ids from inventory 
       const organization= new mongoose.Types.ObjectId(req.body.userId)
        const uniqueDonarIds= await Inventory.distinct("donar", {
            organization,
        });

        const donars = await User.find({
            _id: {$in : uniqueDonarIds},
        })
        // console.log(uniqueDonorIds);
        // console.log(donars);

        return res.send({
            success: true,
            message: "Donars fetched successfully",
            data: donars,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        })
    }
})

// get all unique hospitals 

router.get("/get-all-hospitals", authMiddlewares, async(req,res)=>{
    try {
        // get all unique hospital ids form inventory 
        const organization= new mongoose.Types.ObjectId(req.body.userId);
        const uniqueHospitalIds= await Inventory.distinct("hospital",{
            organization
        });
        
        const hospitals= await User.find({
            _id: {$in : uniqueHospitalIds},
        });

        return res.send({
            success: true,
            message: "Hospitals fetched successfully",
            data: hospitals,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        })
    }
})

// get all unique organization for a donar 

router.get("/get-all-organizations-of-a-donar", authMiddlewares, async(req,res)=>{
    try {
        // get all unique organization ids for a donar from inventory 
        const donar= new mongoose.Types.ObjectId(req.body.userId);
        const uniqueOrganizationsIds= await Inventory.distinct("organization",{
            donar,
        });

        const organizations = await User.find({_id: {$in: uniqueOrganizationsIds}});

        return res.send({
            success: true,
            message: "Organization fetched successfully",
            data: organizations,
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        })
    }
})

// get all unique organization for a hospital
router.get("/get-all-organizations-of-a-hospital",authMiddlewares, async(req,res)=>{
    try {
        // get all unique organization ids for a hospital from inventory 
        const hospital = new mongoose.Types.ObjectId(req.body.userId);
        const uniqueOrganizationsIdsHosp= await Inventory.distinct("organization",{
            hospital
        });

        const organizationsHosp= await User.find({
            _id: {$in: uniqueOrganizationsIdsHosp}
        });

        return res.send({
            success: true,
            message: "Organizations fetched successfully",
            data: organizationsHosp,
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        });
    }
})



module.exports= router;