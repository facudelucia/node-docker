const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    username: {
        type: String,
        require: [true, 'User must have username']
    },
    password: {
        type: String,
        require: [true, 'User must have password']
    }
})

const User = model("User", userSchema)

module.exports = User