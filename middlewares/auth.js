import {User} from "../model/user.js";
import {verifyToken} from "../auth/jwt";

export async function auth(req,res,next) {

    const authToken = req.cookies?.auth;

    if(!authToken) return res.status(401).json({message: "UnAuthorised: Auth token not found!", status: 401});

    const user = await verifyToken(authToken);
    const verifiedUser = await User.findById(user.id);

    if(!verifiedUser) return res.status(401).json({message: "UnAuthorised: Auth token is invalid!", status: 401});

    req.user = verifiedUser;

    next();
}