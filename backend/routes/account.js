const express = require('express');
const router = express.Router();
const zod = require("zod")
const mongoose=require("mongoose")
const { userdb, accountdb } = require("../db")
const { JWT_SECRET } = require("../config")
const jwt = require("jsonwebtoken");
const { authMiddleware } = require('../Middleware/auth');

router.get("/balance",authMiddleware,async(req,res)=>{
    const userId=req.userId;
  
        const account=await accountdb.findOne({userId:userId});
        if(!account){
            return res.status(411).json({message:"User not found"});
        }
        else{
            res.status(200).json({balance:account.balance});
    }
})
router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await accountdb.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }
   const toAcc=to
    const toAccount = await accountdb.findOne({ userId: toAcc }).session(session);

    if (!toAccount) {
        console.log("Recipient account not found for userId:", toAccount);
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await accountdb.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await accountdb.updateOne({ userId: toAcc }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
});





module.exports = router;