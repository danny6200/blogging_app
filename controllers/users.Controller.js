const UserModel = require("../db/models/users.Model");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const CreateUser = async (req, res) => {
  try {
    const userFromRequest = req.body;

    const existingUser = await UserModel.findOne({ email: userFromRequest.email });

    if (!existingUser) {
        const newUser = await UserModel.create({
            first_name: userFromRequest.first_name,
            last_name: userFromRequest.last_name,
            email: userFromRequest.email,
            password: userFromRequest.password
          });

          //Create Token for User
          // const token = jwt.sign({ email: newUser.email, _id: newUser._id }, process.env.JWT_SECRET);

          message = "Signed up successfully"
          return res.status(201).render("log_in", {message: message})
    }
    
    message = "User with email already exists."
    return res.status(400).render("sign_up", {message: message})

  } catch (error) {
    return res.status(500).redirect("/")
  }
};

// Login Process
const Login = async (req, res) => {

    try {
        const userFromRequest = req.body;

        const user = await UserModel.findOne({ email: userFromRequest.email });

        if (!user){
        return res.status(301).redirect("/auth/sign_up")
        }

        const validPassword = await user.isValidPassword(userFromRequest.password);

        if (!validPassword){

            message = "Email or password is invalid!"
            return res.status(422).render("log_in", {message: message})
        }

        token = await jwt.sign({ email: user.email, _id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})
        res.cookie("token", token)
        message = "Logged in successfully"
        return res.status(200).render("dashboard", {message: message, user: user})
    } catch (error) {
        return res.status(500).send({error: error.message})
    }

}

const LogOut = (req, res) => {
  try {
    res.clearCookie("token");
    const message = "Logged out successfully"
    return res.status(440).render("log_in", {message: message});
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};

module.exports = { 
    CreateUser,
    Login,
    LogOut,
};