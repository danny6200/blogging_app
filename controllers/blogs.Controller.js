const BlogModel = require("../db/models/blogs.Model");
const Mongoose = require("mongoose");
const {readingTime} = require("../utils/helper")


const GetAllBlogs = async (req, res) => {
    try {
        var query;
        
        if (req.query){
            query = req.query;
        }

        const blogs = await BlogModel.find({state: "published"})
        let blogs_duplicate = blogs
        
        limit = query.limit || 20
        page = query.page || 1

        start = (page - 1) * limit;
        end = page * limit
        
        // if (req.query && req.query.state){
        //     blogs_duplicate = blogs_duplicate.filter((blog) => blog.state.includes(req.query.state))

        // }


        if (limit){
            blogs_duplicate = blogs_duplicate.slice(0, limit)
        }

        return res.status(200).render("viewBlogs", {blogs: blogs_duplicate})

    } catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}

const GetUserBlogs = async (req, res) => {
    try {
        const user = res.locals.user;
        const blogs = await BlogModel.find({author: user._id})
        let blogs_duplicate = blogs
        
        if (req.query && req.query.state){
            blogs_duplicate = blogs_duplicate.filter((blog) => blog.state.includes(req.query.state))

        }


        if (req.query && req.query.limit){
            blogs_duplicate = blogs_duplicate.slice(0, req.query.limit)
        }

        return res.status(200).render("viewBlogs", {blogs: blogs_duplicate})

    } catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}



const CreateBlog = async (req, res) => {
    try {
        const user = res.locals.user;
        const blog = req.body;
        const time = readingTime(blog.body)

        await BlogModel.create({
            title: blog.title,
            description: blog.description,
            author: user._id,
            body: blog.body,
            tags: blog.tags,
            reading_time: time
        })
        return res.status(201).redirect("/blogs")

    } catch (error) {
        return res.status(500).send({
            error: error.message
        })
    }
}


const EditBlog = async (req, res) => {
    const blog = await TaskModel.findById(req.params.id)
    res.status(200).render("editBlog", {blog: blog, message:""})
}


const UpdateBlog = async (req, res) => {
    try {
        const blog = await BlogModel.findById(req.params.id)

        if (!blog){
            return res.status(404).render("404")
        }

        const update = req.body
        if (!update){
            message="Fields cannot be empty"
            return res.status(400).render("editBlog", {blog: blog, message: message})
        }
        await BlogModel.findByIdAndUpdate(req.params.id, update);

        return res.status(200).redirect("/blogs")

    } catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }

}



const DeleteBlog = async (req, res) => {
    try {
        await BlogModel.findByIdAndRemove(req.params.id)
        return res.status(200).redirect("/blogs")
    
    } catch (error) {
        return res.status(500).send({error: error.message})
    }
}


module.exports = {
    GetAllBlogs,
    GetUserBlogs,
    CreateBlog,
    EditBlog,
    UpdateBlog,
    DeleteBlog
}