import TravelStory from "../models/travelStory.model.js"
import { errorHandler } from "../utils/error.js"

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