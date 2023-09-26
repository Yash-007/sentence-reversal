const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    userType: {
        type: String,
        required: true,
        enum: ['donar', 'organization', 'hospital', 'admin'],
    },

    //  if userType is donar or admin 
    name: {
        type: String,
        required: function () {
            if (this.userType == "admin" || this.userType == "donar") {
                return true;
            }
            return false;
        },
    },

    //  if userType is hospital
    hospitalName: {
        type: String,
        required: function () {
            if (this.userType == "hospital") {
                return true;
            }
            return false;
        },
    },


    //  if userType is organization
    organizationName: {
        type: String,
        required: function () {
            if (this.userType == "organization") {
                return true;
            }
            return false;
        },
    },

    //  if userType is hospital or organization
    website: {
        type: String,
        required: function () {
            if (this.userType == "hospital" || this.userType == "organization") {
                return true;
            }
            return false;
        },
    },

    //  if userType is hospital or organization
    address: {
        type: String,
        _required: function () {
            if (this.userType == "hospital" || this.userType == "organization") {
                return true;
            }
            return false;
        },
        get required() {
            return this._required;
        },
        set required(value) {
            this._required = value;
        },
    },

    // common for all 

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});


module.exports = mongoose.model("user", userSchema);