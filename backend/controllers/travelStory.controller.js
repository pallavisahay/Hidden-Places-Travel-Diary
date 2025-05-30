import { response } from "express"
import TravelStory from "../models/travelStory.model.js"
import { errorHandler } from "../utils/error.js"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"
import { request } from "http"



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
export const editTravelStory = async(request, response, next)=>{
    const {id}=request.params
    const {title, story, visitedLocation, imageUrl, visitedDate} = request.body
    const userId= request.user.id

    if(!title || !story || !visitedLocation || !imageUrl || !visitedDate){
    return next(errorHandler(400, "All fields are required"))
}
const parsedVisitedDate= new Date(parseInt(visitedDate))
try {
    const travelStory = await TravelStory.findOne({_id :id, userId: userId})
    if(!travelStory){
       return next(errorHandler(404, "Travel Story not found!"))
    }
    const placeholderImageUrl = `http://localhost:3000/assets/placeholderImage.jpeg`
    travelStory.title=title 
    travelStory.story=story
    travelStory.visitedLocation=visitedLocation
    travelStory.imageUrl=imageUrl || placeholderImageUrl
    travelStory.visitedDate=parsedVisitedDate
    await  travelStory.save()
    response.status(200).json({
        story : travelStory,
        message : "Travel Story Updated SuccessFully!"
    })
} catch (error) {
   next(error) 
}
}
export const deleteTravelStory= async(request, response, next)=>{
    const { id }=request.params
    const userId = request.user.id
    try {
        const travelStory = await TravelStory.findOne({_id :id, userId: userId})
         if(!travelStory){
       return next(errorHandler(404, "Travel Story not found!"))
    }
    await travelStory.deleteOne()
        const imageUrl=travelStory.imageUrl
const filename= path.basename(imageUrl)
const filePath=path.join(rootDir, "uploads" , filename)

if(!fs.existsSync(filePath)){
    return next(errorHandler(404, "image not found"))

}
await fs.promises.unlink(filePath)
response.status(200).json({message : "travel story deleted successfully"})
    } catch (error) {
       next(error) 
    }
} 
export const updateIsFavourite = async(request, response, next)=>{
    const {id} =request.params
    const{isFavourite}=request.body
    const userId=request.user.id
    try {
     const travelStory= await TravelStory.findOne({_id:id, userId : userId})  
     if(!travelStory){
        return next(errorHandler(404, "Travel Story not found"))
     } 
     travelStory.isFavourite=isFavourite
     await travelStory.save()
     response.status(200).json({story : travelStory, message : "updated Successfully"})
    } catch (error) {
        next(error)
    }
}
export const searchTravelStory= async(request, response, next)=>{
const {query} = request.query
const userId = request.user.id
if(!query){
    return next(errorHandler(404, "Query is required"))
}
try {
    const searchResult= await TravelStory.find({
        userId: userId,
        $or : [
            {title : {$regex : query, $options : "i"}},
            {story : {$regex : query, $options : "i"}},
            {visitedLocation : {$regex : query, $options : "i"}}
        ]
    }).sort({isFavourite : -1})
    response.status(200).json({stories : searchResult,})
} catch (error) {
    next(error)
}
}
export const filterTravelStories= async(request, response, next)=>{
const {startDate, endDate}=request.query
const userId=request.user.id
try {
    const start = new Date(parseInt(startDate))
    const end = new Date(parseInt(endDate))
    const filteredStories = await TravelStory.find({
        userId : userId,
        visitedDate :  {$gte: start, $lte : end},
    }).sort({isFavourite: -1})
    response.status(200).json({stories : filteredStories})

} catch (error) {
    next(error)
}
}