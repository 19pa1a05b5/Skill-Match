require("dotenv").config();
const jwt = require("jsonwebtoken");

function employerMiddleware(req, res, next) {
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_EMPLOYER_PASSWORD);

    if(decoded){
        req.id = decoded.id;
        next()
    }else{
        res.status(403).json({
            message: "You are not signed in"
        })
    }
}

module.exports = {
    employerMiddleware
}