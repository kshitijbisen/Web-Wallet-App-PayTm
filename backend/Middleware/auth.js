const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const authMiddleware=(req,res,next)=>{
    const token=req.headers.authorization;
    if(!token||!token.startsWith("Bearer ")){
        return res.status(403).json({message:"Auth failed"})
    }
    else{
       const token2= token.split(' ')[1]
       try {
        const decoded = jwt.verify(token2, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({});
    }
}
}
module.exports = {
    authMiddleware
}