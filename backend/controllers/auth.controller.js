import bcryptjs from "bcryptjs"
import User from "../models/user.model.js";
import { request, response } from "express";
import { errorHandler } from "../utils/error.js";

export const signup = async(request,response, next)=>{
    const {username , email, password} = request.body

    if(!username || !email || !password || username=="" || email=="" || password==""){
        return next(errorHandler(400, "All fields are required"))
    }
 const hashedPassword=  bcryptjs.hashSync(password, 10)

 const newUser= new User({
    username, 
    email,
    password : hashedPassword,
 })
 try{
    await newUser.save()
    response.json("Signup Successfully")
 } catch(error){
 next(error)
 }
 

}