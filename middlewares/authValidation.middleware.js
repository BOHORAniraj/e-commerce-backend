import { verifyAccessJWT } from "../helpers/jwt.helper.js";
import { getSession } from "../models/session/Session.model.js";
import { getUserById } from "../models/user-model/User.model.js";



export const UserAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
// console.log(authorization)
        if (authorization) {
            const decoded = verifyAccessJWT(authorization);

            if (decoded === "jwt expired") {
                return res.status(403).json({
                    status: "error",
                    message:"jwt expired",
                })
            }

            const sessiondb = decoded?.email ? await getSession({ token: authorization }) : null;
            if (sessiondb?._id) {
                const user = await getUserById(sessiondb.userId);
// console.log(sessiondb._id)
                if (user?.role === "user") {
                    req.user = user;
                    req.user.password = undefined;
                    req.user.refreshJWT = undefined; 
                    next();
                    return;

                }
                    
                
            }
            return res.status(401).json({
                status: 401,
                message:"Unauthorized",
            })

        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"server error",
        })
    }

}