const express = require("express")
const methodOverride = require('method-override')
const cookieParser = require("cookie-parser")
const db = require("./db")
const authRouter = require("./routes/auth.Route")
const blogRouter = require("./routes/blogs.Route");
const controller = require("./controllers/blogs.Controller")
require("dotenv").config()


const app = express()

db.connect()

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser());


app.set('view engine', 'ejs')

app.use("/auth", authRouter);
app.use("/blogs", blogRouter);

app.get("/", controller.GetAllBlogs)
app.get("/:id", controller.GetOneBlog)

app.get("*", (req, res) => {
    return res.render("404")
})

app.listen(process.env.PORT, () => {
    console.log(`Server started at http://localhost:${process.env.PORT}`)
})