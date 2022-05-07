const { Schema, model } = require('mongoose')

const postSchema = new Schema({
    title: {
        type: String,
        require: [true, 'Post must have title']
    },
    body: {
        type: String,
        require: [true, 'Post must have body']
    }
})

const Post = model("Post", postSchema)

module.exports = Post