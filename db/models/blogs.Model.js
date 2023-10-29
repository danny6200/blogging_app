const mongoose = require("mongoose")


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const blogSchema = new Schema({
  title: {type: String, required: true, unique: true},
  description: {type: String},
  author: {type: ObjectId, ref: 'User'},
  state: {type: String, enum: ['draft', 'published'], default: 'draft'},
  read_count: {type: Number, default: 0},
  reading_time: {type: Number},
  tags: {type: [String], default: ['Technology', 'Lifestyle', 'Inspiration']},
  body: {type: String, required: true},
  timestamp: {type: Date, default: Date.now()}
});

const BlogModel = mongoose.model('Blog', blogSchema);


module.exports = BlogModel;