const {verifyToken} = require("../auth/jwt");
const User = require('../models/user')

async function auth(req, res, next) {

    const authToken = req.cookies?.token;

    if (!authToken) return res.status(401).json({message: "UnAuthorised: Auth token not found!", status: 401});

    const user = await verifyToken(authToken);

    const verifiedUser = await User.findById(user.id);

    if (!verifiedUser) return res.status(401).json({message: "UnAuthorised: Auth token is invalid!", status: 401});

    req.user = verifiedUser;

    next();
}

module.exports = {auth};