const express = require('express');
const router = express.Router();
const zod = require("zod")
const { userdb, accountdb } = require("../db")
const { JWT_SECRET } = require("../config")
const jwt = require("jsonwebtoken");
const { authMiddleware } = require('../Middleware/auth');
const signUpSchema = zod.object({
    username: zod.string().email(),
    firstname: zod.string().min(1),
    lastname: zod.string().min(1),
    password: zod.string().min(8),
})
const updateSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

const signInSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(8),
})
router.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const user = {
        username: username,
        firstname: firstname,
        lastname: lastname,
        password: password,

    }
    if (!signUpSchema.safeParse(user).success) {
        return res.status(411).json({ message: "Invalid Inputs" });
    }

    if (await userdb.findOne({ username: username })) {
        return res.status(400).json({ message: "User already exists" });
    }
    else {
        const newUser = await userdb.create(user)
        const userId = newUser._id;
        const token = jwt.sign({ userId }, JWT_SECRET);
        await accountdb.create({ userId, balance: 1 + Math.random() * 10000 })

        return res.status(200).json({
            message: "User created successfully",
            token: token
        });

    }
})

router.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = {
        username: username,
        password: password,
    }
    if (!signInSchema.safeParse(user).success) {
        return res.status(411).json({ message: "Invalid Inputs" });
    }
    const currentUser = await userdb.findOne(user);

    if (currentUser) {
        const userId = currentUser._id;
        const token = jwt.sign({ userId }, JWT_SECRET);
        res.status(200).json({
            message: "login successfully",
            token: token
        })
    }
    else {
        return res.status(411).json({ message: "Incorrenct Password or id" });
    }
})

router.put("/update", authMiddleware, async (req, res) => {
    const update = req.body;
    if (!updateSchema.safeParse(update).success) {
        return res.status(411).json({ message: "Error while updating information" })
    }
    else {
        await userdb.updateOne({ _id: req.userId }, update)
        res.status(200).json({ message: "Updated successfully" })
    }

})
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
    
    console.log(filter)
    const users = await userdb.find({
        $or: [{
            firstname: {
                "$regex": filter, 
                "$options": "i"
            }
        }, {
            lastname: {
                "$regex": filter,
                "$options": "i"
            }
        }]
    })
    console.log(users)

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    })
})


module.exports = router;