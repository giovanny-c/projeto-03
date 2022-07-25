import "reflect-metadata"
import express from "express"
import cors from "cors"
// import { auth, requiresAuth } from "express-openid-connect"

import "express-async-errors"


//db e containers
import "./database"
import "@shared/container"

//routes
import { errorHandler } from "@shared/errors/ErrorHandler" //colocar em cima?
import { accountRoutes } from "./routes/account.routes"
//import { config } from "../src/config/auth"


const app = express()


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))//front


// app.use(auth(config))

app.use("/accounts", accountRoutes)


app.use(errorHandler)//middleware de errors


export { app }