const router= require("express").Router();
const mongoose = require('mongoose');
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/userModel");
const dataModel = require("../models/dataModel");


router.post("/add-data", authMiddleware, async(req,res)=>{
    try {
     const user = await User.findOne({_id: req.body.userId});
     if(!user) throw new Error("User Not Found");

     req.body.userr= user._id;

    //  add data 
     const data = new dataModel(req.body);
     await data.save();

     res.send({
        success: true,
        message: "result added successfully",
     });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
         });   
    }
})

router.get("/get-data", authMiddleware, async(req,res)=>{
    try {
        const userr= new mongoose.Types.ObjectId(req.body.userId);
        const record= await dataModel.aggregate([
            {
                $match: {
                  userr
                },
            },
            {
                $group: {
                    _id: "$userr",
                    avg: {$avg : "$speed"},
                    high: {$max : "$speed"},
                }
            }
        ])
        const count = await dataModel.countDocuments({ userr: req.body.userId });
        const data= await dataModel.find({userr: req.body.userId}).sort({createdAt: -1});
        const avgspeed= record[0]?.avg || 0;
        const highest = record[0]?.high || 0;
        return res.send({
            success: true,
            record: {count, data, avgspeed, highest},
        });
    } catch (error) {
        return res.send({success: false , message: error.message});
    } 
})

module.exports= router;