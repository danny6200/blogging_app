const UserModel = require("../db/models/users.Model");
const jwt = require("jsonwebtoken");
require("dotenv").config();



const bearerTokenAuth = async (req, res, next) => {
    try {
        
        const token = req.cookies.token
        let decoded;
        try {
            decoded = await jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).send({ error: error.message });
        }

        const user = await UserModel.findOne({ email: decoded.email, _id: decoded._id });

        if (!user){
            return res.redirect("/auth/log_in")
        }

        res.locals.user = user;

        next()
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

module.exports = { bearerTokenAuth };