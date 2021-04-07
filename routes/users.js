const express = require("express")
const jwt = require("jsonwebtoken")
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth")
const User = require("../models/user")

const router = new express.Router()

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get("", ensureLoggedIn, async (req, res, next) => {
    try {
        let list = await User.all()
        return res.json({users: list})
    } catch (error) {
        return next(error)
    }
})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get("/:username", ensureLoggedIn, async (req, res, next) => {
    try {
        let user = await User.get(req.param.username)
        return res.json({user: user})
    } catch (error) {
        return next(error)
    }
})


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get("/:username/to", ensureCorrectUser, async (req, res, next) => {
    try {
        let messages = await User.messagesTo(req.param.username)
        return res.json({messages: messages})
    } catch (error) {
        return next(error)
    }
})


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get("/:username/from", ensureCorrectUser, async (req, res, next) => {
    try {
        let messages = await User.messagesFrom(req.param.username)
        return res.json({messages: messages})
    } catch (error) {
        return next(error)
    }
})

module.exports = router