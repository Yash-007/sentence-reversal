const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
 speed:{
  type: Number,
  required: true,
 },
 userr:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
 },
},
{
    timestamps: true,
},
);

 const dataModel = mongoose.model("data",dataSchema);
 module.exports = dataModel;