
const mongoose = require('mongoose'); 
const { number } = require('zod');
mongoose.connect("mongodb+srv://mailticks:mailticks2023@gmailcluster.nk4rv0b.mongodb.net/"); 
  
const userSchema = new mongoose.Schema({ 
    username: { 
        type: String, 
        require: true,
        minLength:6,
        maxLength:30,
        unique:true,
        trim:true,
        lowercase:true

    },
    firstname: { 
        type: String, 
        require: true,
        minLength:1,
        maxLength:30,
        trim:true
    }, 
    lastname: { 
        type: String, 
        require: true,
        minLength:1,
        maxLength:30,
        trim:true
    }, 
    password: { 
        type: String, 
        require: true,
        minLength:8,
        maxLength:30,
        
    }
}) 
const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        require:true
    },
    balance:{
        type:Number,
        require:true
    }
})
const userdb=mongoose.model('users',userSchema);
const accountdb=mongoose.model('account',accountSchema);
module.exports={userdb:userdb,accountdb};