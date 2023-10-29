const router = require("express").Router();
const middleware = require("../middlewares/blogs.Middleware");
const authmiddleware = require("../middlewares/auth.Middleware")
const controller = require("../controllers/blogs.Controller");


router.use(authmiddleware.bearerTokenAuth);

router.get("/", controller.GetUserBlogs)

router.get("/create", (req, res) => {
    res.status(200).render("createBlog")
})

router.post("/", middleware.ValidateBlogCreation, controller.CreateBlog)

// Edit Blog
router.get("/:id/edit", controller.EditBlog)

// Update Blog
router.patch("/:id", middleware.ValidateUpdateDetails, controller.UpdateBlog)

//Delete Blog
router.delete("/:id", controller.DeleteBlog)

module.exports = router;