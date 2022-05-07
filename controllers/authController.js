const User = require('../models/userModel')
const bcrypt = require('bcryptjs')


exports.signUp = async (req, res) => {
    const { username, password } = req.body
    const hash = await bcrypt.hash(password, 12)
    try {
        const newUser = await User.create({
            username,
            password: hash
        })
        req.session.user = newUser
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail'
        })
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'user not found'
            })
        }
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(400).json({
                status: 'fail',
                message: 'incorrect username or password'
            })
        } else {
            req.session.user = user
            res.status(200).json({
                status: 'success'
            })
        }

    } catch (error) {
        res.status(400).json({
            status: 'fail'
        })
    }
}