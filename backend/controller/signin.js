const message = require("../message");
const usermodel = require("../user");
const bcrypt = require("bcrypt");   

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user= await usermodel.findOne({email});
        if (user) {
            return res.status(409).json({ message: "User is already exist ", success: false });
        }
        const userModel = new usermodel({
            email,
            password: await bcrypt.hash(password, 10)
        });
        await userModel.save();
        res.status(201).json({ message: "User signed in successfully", success: true });
    } 
    catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
}
module.exports = {signin};
