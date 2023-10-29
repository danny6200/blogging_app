const router = require("express").Router();
const middleware = require("../middlewares/users.Middleware")
const controller = require("../controllers/users.Controller")
// const cookieParser = require("cookie-parser")

// router.use(cookieParser());


//Get user sign_up details
router.get("/sign_up", (req, res) => {
    res.render("sign_up", {message: ""})
})

// Get user log_in details
router.get("/log_in", (req, res) => {
    res.render("log_in", {message: ""})
})

// Create user in database
router.post("/sign_up", middleware.ValidateUserCreation, controller.CreateUser)

// Logs in user
router.post("/log_in", middleware.LoginValidation, controller.Login)

//logs out user
router.get("/log_out", controller.LogOut)



module.exports = router;