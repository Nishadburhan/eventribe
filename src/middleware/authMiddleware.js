const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Config = require("../config/config");

const verifyToken = (req, res, next)  => {
 if(req.headers && req.headers.authorization) {
    jwt.verify(
        req.headers.authorization,
        Config.JWT_SECRET,
        (err, decoded) => {
            if(err) {
                req.user = undefined;
                req.message = err.message;
                next();
            } else {
                User.findOne({
                    _id: decoded.id,
                }).then((user) => {
                    req.user = user;
                    req.message = "Found the user successfully";
                    next();
                }).catch((err) => {
                    req.user = undefined;
                    req.message = err.message;
                    next(); 
                });
            }
        }
    );
 } else {
    req.user = undefined;
    req.message = "Authorization Header Is not found!";
    next();
 }
}
module.exports = verifyToken;