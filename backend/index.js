import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import authRoutes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.route.js"
import travelStoryRoutes from "./routes/travelStory.route.js"
import { fileURLToPath } from "url"


dotenv.config()
mongoose.connect(process.env.MONGO_URI).then(
    ()=>{
        console.log("Database is connected");
    }
).catch((err)=>{
    console.log(err);
})

const app = express()


app.use(cookieParser())

app.use(express.json())


app.listen(3000,()=>{
    console.log("Server is running on port 3000!")
})

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/travel-story", travelStoryRoutes)

const __filename = fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

app.use("/uploads", express.static(path.join(__dirname, "uploads")))



app.use((error, request, response, next)=>{
    const statusCode= error.statusCode  || 500

    const message= error.message || "internal server error"

    response.status(statusCode).json({
        success : false,
        statusCode,
        message,
    })
})
