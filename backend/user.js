const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    }
});
const usermodel= mongoose.model("User", userSchema);
module.exports = usermodel;