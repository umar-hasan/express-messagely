const express = require("express")
const jwt = require("jsonwebtoken")
const ExpressError = require("../expressError")
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth")
const Message = require("../models/message")
const router = new express.Router()

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get("/:id", ensureLoggedIn, async (req, res, next) => {
    try {
        let message_info = await Message.get(req.params.id)
        if (req.user === message_info["from_user"] || req.user === message_info["to_user"]) {
            return res.json({message: message_info})
        }
        else {
            throw new ExpressError("You are not authorized to view this.", 400)
        }
    } catch (error) {
        return next(error)
    }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

 router.post("", ensureLoggedIn, async (req, res, next) => {
    try {
        let message = await Message.create(req.user, req.body.to_username, body)
        return res.json({message: message})
    } catch (error) {
        return next(error)
    }
})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

 router.post("/:id/read", ensureLoggedIn, async (req, res, next) => {
    try {
        let message = await Message.get(req.params.id)
        let message_info = await Message.markRead(req.params.id)
        if (req.user === message["to_user"]) {
            return res.json({message: message_info})
        }
        else {
            throw new ExpressError("This is not your message to mark as read.", 400)
        }
    } catch (error) {
        return next(error)
    }
})

module.exports = router