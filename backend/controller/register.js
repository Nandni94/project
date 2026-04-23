const register = async (req, res) => {
    try {
        const { username,email, password } = req.body;
        const user= await usermodel.findOne({username});
        const user1= await usermodel.findOne({email});
        if (user) {
            return res.status(409).json({ message: "User is already exist ", success: false });
        }
        if (user1) {
            return res.status(409).json({ message: "Email is already exist ", success: false });
        }
        const userModel = new usermodel({
            username,
            email,
            password: await bcrypt.hash(password, 10)
        });
        await userModel.save();
        res.status(201).json({ message: "User registered successfully", success: true });
    } 
    catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
}
module.exports = {register};
