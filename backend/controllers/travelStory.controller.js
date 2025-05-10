import { response } from "express"
import TravelStory from "../models/travelStory.model.js"
import { errorHandler } from "../utils/error.js"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

export const addTravelStory = async(request, response, next)=>{
const { title, story, visitedLocation, imageUrl, visitedDate }= request.body

const userId=request.user.id

//validate required fields
if(!title || !story || !visitedLocation || !imageUrl || !visitedDate){
    return next(errorHandler(400, "All fields are required"))
}

const parsedVisitedDate= new Date(parseInt(visitedDate))
try {
    const travelStory= new TravelStory({
        title,
        story,
        visitedLocation,
        userId,
        imageUrl,
        visitedDate : parsedVisitedDate,
    })
    await travelStory.save()
    response.status(201).json({
        story : travelStory,
        message : "Your story is added successfully!"
    })
} catch (error) {
  next(error)  
}
}
export const getAllTravelStory= async(request, response, next )=>{
    const userId=request.user.id
    try {
        const travelStories= await TravelStory.find({userId : userId}).sort({
            isFavourite : -1,
        })
        response.status(200).json({stories : travelStories })
    } catch (error) {
      next(error)  
    }
}
export const imageUpload = async(request, response, next)=>{
    try {
        if(!request.file){
            return next(errorHandler(400, "No image uploaded"))
        }
        const imageUrl= `http://localhost:3000/uploads/${request.file.filename}`

        response.status(201).json({ imageUrl })
    } catch (error) {
        next(error)
    }
}
const __filename= fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)
const rootDir =path.join(__dirname, "..")
export const deleteImage= async(request,response,next) =>{
    const{imageUrl} = request.query
    if(!imageUrl){
        return next(errorHandler(400, "imageUrl parameter is required"))
    }
    try {
        const filename= path.basename(imageUrl)

        const filePath=path.join(rootDir, "uploads", filename)

        console.log(filePath)
        if(!fs.existsSync(filePath)){
            return next(errorHandler(404, "image not found!"))
        } 
        await fs.promises.unlink(filePath)
        response.status(200),json({message: "Image Deleted Successfully!"})
    } catch (error) {
        next(error)
    }
}