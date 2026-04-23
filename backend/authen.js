const router = require("express").Router();
const User = require("./Model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { users, createUserId } = require("./localStore");

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "username, email and password are required" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const isDbConnected = mongoose.connection.readyState === 1;

        if (isDbConnected) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ error: "Email already registered" });
            }

            const user = new User({
                username,
                email,
                password: hashPassword
            });

            await user.save();
            return res.json("User Registered");
        }

        const existingLocalUser = users.find((u) => u.email === email);
        if (existingLocalUser) {
            return res.status(409).json({ error: "Email already registered (local mode)" });
        }

        users.push({
            _id: createUserId(),
            username,
            email,
            password: hashPassword
        });

        res.json("User Registered (local mode)");
    } catch (error) {
        console.error("Register error:", error.message);
        res.status(500).json({ error: "Registration failed" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const isDbConnected = mongoose.connection.readyState === 1;

        let user = null;

        if (isDbConnected) {
            user = await User.findOne({ email });
        } else {
            user = users.find((u) => u.email === email) || null;
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid Password" });
        }

        const token = jwt.sign({ id: user._id }, "secretkey");
        res.json({ token, user });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ error: "Login failed" });
    }
});

module.exports = router;
