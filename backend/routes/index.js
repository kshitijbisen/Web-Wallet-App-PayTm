const express = require('express');
const router = express.Router();
const userRouter=require("./user")
const acountRouter=require("./account")

router.use("/user",userRouter);
router.use("/account",acountRouter);

module.exports = router;