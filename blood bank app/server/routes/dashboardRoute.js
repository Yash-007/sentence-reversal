const router= require("express").Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const Inventory= require("../models/inventoryModel");
const mongoose = require("mongoose");

// get all blood  groups totalIn, totalOut, available data from inventory 
router.get("/blood-groups-data", authMiddleware, async(req,res)=>{
    try {
     const allBloodGroups= ["a+","a-","b+","b-","ab+","ab-","o+","o-"];
     const organization = new mongoose.Types.ObjectId(req.body.userId);
     const bloodGroupData= [];
    

     await Promise.all(
        allBloodGroups.map(async (bloodGroup)=>{
            const totalIn = await Inventory.aggregate([
                {
                    $match : {
                        bloodGroup: bloodGroup,
                        inventoryType: "in",
                        organization,
                    },
                },
                {
                    $group : {
                        _id: null,
                        total: {
                            $sum: "$quantity",
                        },
                    },
                },
            ]);

            const totalOut = await Inventory.aggregate([
                {
                    $match : {
                        bloodGroup: bloodGroup,
                        inventoryType: "out",
                        organization,
                    },
                },
                {
                    $group : {
                        _id: null,
                        total: {
                            $sum: "$quantity",
                        },
                    },
                },
            ]);

            const available = (totalIn[0]?.total || 0)  - (totalOut[0]?.total || 0);

            bloodGroupData.push({
                bloodGroup,
                totalIn: totalIn[0]?.total || 0,
                totalOut: totalOut[0]?.total || 0,
                available,
            });


        })
     )


        res.send({
            success: true,
            message: "Blood Group Data",
            data: bloodGroupData,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
})


module.exports = router;