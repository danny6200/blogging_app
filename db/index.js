const mongoose = require("mongoose")
require("dotenv").config()

const connect = () => {
    mongoose.connect(process.env.MONGODB_URI)

    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB successfully")
    })

    mongoose.connection.on("error", (error) => {
        console.log("Cannot connect to db:", error.message)
    })


}

module.exports = { connect }