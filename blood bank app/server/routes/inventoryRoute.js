const router = require("express").Router();
const Inventory = require("../models/inventoryModel");
const User= require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddlewares");
const mongoose = require("mongoose");

// add inventory 
router.post("/add" , authMiddleware, async(req,res)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        if(!user) throw new Error("Invalid Email");

        if(req.body.inventoryType === "in" && user.userType!=="donar"){
            throw new Erorr("This email is not registered as a donar");
        }
        if(req.body.inventoryType === "out" && user.userType !== "hospital"){
            throw new Erorr("This email is not registered as a hospital");
        }
        
            // if(req.body.inventoryType==="out"){

            // }
            // else{

            // }


            if(req.body.inventoryType==="out"){
                const requestedGroup = req.body.bloodGroup;
                const requestedQuantity= req.body.quantity;
                const organization= new mongoose.Types.ObjectId(req.body.userId);

                const totalInOfRequestedGroup= await Inventory.aggregate([
                    {
                        $match : {
                            organization,
                            inventoryType: "in",
                            bloodGroup: requestedGroup,
                        },
                    },
                    {
                            $group : {
                                _id: "$bloodGroup",
                                total: {$sum : "$quantity"},
                            },
                     },
                ]);

              const totalIn = totalInOfRequestedGroup[0]?.total || 0;
             
              const totalOutOfRequestedGroup = await Inventory.aggregate([
                {
                    $match: {
                        organization,
                        inventoryType: "out",
                        bloodGroup: requestedGroup,
                    },
                },

                {
                    $group: {
                        _id: "$bloodGroup",
                        total: {$sum: "$quantity"},
                    },
                },
              ]);

              const totalOut= totalOutOfRequestedGroup[0]?.total || 0;

              const available= (totalIn-totalOut) || 0;

              if(available < requestedQuantity){
                console.log(available);
                // throw new Erorr(`only ${available} units of ${requestedGroup} is available`)
                throw new Error("This much quantity of blood is not available");
              }
              req.body.hospital = user._id;
            }
            else{
                req.body.donar= user._id;
            }

        // add Inventory 
        const inventory = new Inventory(req.body);
        await inventory.save();

        return res.send({
            success: true,
            message: "Inventory Added Successfully",
        })
    }
    catch(error){
        return res.send({success: false, message: error.message});
    }
});

// get inventory 
router.get("/get", authMiddleware, async(req,res)=>{
    try {
        const inventory = await Inventory.find({organization : req.body.userId}).sort({createdAt: -1})
        .populate("donar")
        .populate("hospital");
        return res.send({success: true, data: inventory});
    } catch (error){
        return res.send({success: false , message: error.message});
    }
});


// get inventory 
router.post("/filter", authMiddleware, async(req,res)=>{
    try {
        const inventory = await Inventory.find(req.body.filters).sort({createdAt: -1}).limit(req.body.limit || 100)
        .populate("donar")
        .populate("hospital")
        .populate("organization");
        return res.send({success: true, data: inventory});
    } catch (error){
        return res.send({success: false , message: error.message});
    }
});

module.exports = router;
