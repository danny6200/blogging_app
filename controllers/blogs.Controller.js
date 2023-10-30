const BlogModel = require("../db/models/blogs.Model");
const Mongoose = require("mongoose");
const {readingTime} = require("../utils/helper");
const UserModel = require("../db/models/users.Model");


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
        
        if (query.search){
            blogs_duplicate = blogs_duplicate.filter((blog) => blog.author.includes(query.search) || 
                                                                blog.title.includes(query.search) || 
                                                                blog.tags.includes(query.search))

        }


        if (limit){
            blogs_duplicate = blogs_duplicate.slice(start, end)
        }

        return res.status(200).render("generalView", {blogs: blogs_duplicate})

    } catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}

const GetOneBlog = async (req, res) => {
    try {
        user = res.locals.user
        const blog = await BlogModel.findById(req.params.id)

        if(!blog) {
            return res.status(404).render("404")
        }

        const author = await UserModel.findById(blog.author)
        var read_count = blog.read_count
        read_count += 1;
        blog.read_count = read_count

        return res.status(200).render("viewSingle", {blog: blog, user: user, author: author})

    } catch (error) {
       return res.status(500).send({
        error: error.message
       }) 
    }
}

const GetUserBlogs = async (req, res) => {
    try {
        var query;
        
        if (req.query){
            query = req.query;
        }

        const user = res.locals.user;
        const blogs = await BlogModel.find({author: user._id})
        let blogs_duplicate = blogs
        
        limit = query.limit || 10
        page = query.page || 1

        start = (page - 1) * limit;
        end = page * limit
        
        if (query.state){
            blogs_duplicate = blogs_duplicate.filter((blog) => blog.state.includes(query.state))

        }


        // if (limit){
        //     blogs_duplicate = blogs_duplicate.slice(start, end)
        // }
        // console.log(blogs_duplicate)
        return res.status(200).render("viewBlog", {blogs: blogs_duplicate, user: user})

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
        const r_time = `${time} min`
        // console.log({ time })

        await BlogModel.create({
            title: blog.title,
            description: blog.description,
            author: user._id,
            body: blog.body,
            tags: blog.tags,
            reading_time: r_time
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
    GetOneBlog,
    CreateBlog,
    EditBlog,
    UpdateBlog,
    DeleteBlog
}