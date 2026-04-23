const { register } = require("../controller/register");
const { registerValidation } = require("../middleware/validation");
const { signinValidation } = require("../middleware/validation");

const router = require("express").Router();
router.post('./login', signinValidation, (req, res) => {
    res.send("Login route");
});

router.post('./register', registerValidation, (req, res) => {
    res.send("Register route");
});
module.exports = router;