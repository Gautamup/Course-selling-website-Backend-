const jwt = require("jsonwebtoken");
const {JWT_SERCET} = require("../config");


function adminMiddleware(req, res, next) {

    const token = req.headers.authorization;

    const words = token.split(" ");
    const jwtTkn = words[1];

    const decodedVal = jwt.verify(jwtTkn,JWT_SERCET);
    if(decodedVal.username){
        next();
    } else{
        res.status(403).json({
            msg:"You are not authorized"
        })
    }
}

module.exports = adminMiddleware;