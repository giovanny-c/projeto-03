import "reflect-metadata"
import express from "express"

import "express-async-errors"

//front
// import * as nunjucks from "nunjucks"
// import methodOverride from "method-override"

//db e containers
import "./database"
import "./shared/container"

//routes
import { errorHandler } from "./shared/errors/ErrorHandler" //colocar em cima?
import { accountRoutes } from "./routes/account.routes"


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))//front
// app.use(express.static('public'))//front
// app.use(methodOverride('_method'))//front

app.use("/accounts", accountRoutes)

app.use(errorHandler)

//front
// app.set("view engine", "njk")

// nunjucks.configure("views", {
//     express: app,
//     autoescape: true,
//     noCache: true
// })

app.listen(3333, () => console.log("Server runing on port 3333"))

