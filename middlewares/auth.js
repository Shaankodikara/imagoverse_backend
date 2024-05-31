import jwt from 'jsonwebtoken'

export const authorizeUser = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if(!token){
            return res.json({status: "failed", message: "no token"})
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (error) {
       return res.json({error: error})
    }
}

