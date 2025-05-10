import User from "../models/user.model.js"

export const getUsers=async(req, res, next)=>{
    const userId=req.user.id

    const validUser= await User.findOne({_id: userId})
    if(!validUser){
        return next(erroeHandler(401, "Unauthorized"))
    }
    const {password : pass, ...rest}=validUser._doc
    res.status(200).json(rest)
}