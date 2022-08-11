import "reflect-metadata"
import express from "express"
import session from "express-session"
import * as redis from "redis"
import connectRedis, { Client } from "connect-redis"

import cors from "cors"

// import { auth, requiresAuth } from "express-openid-connect"

import "express-async-errors"


//db e containers
import "./database"
import "@shared/container"

import upload from "@config/upload"

//routes
import { errorHandler } from "@shared/errors/ErrorHandler" //colocar em cima?
import { accountRoutes } from "./routes/account.routes"
import { fileRoutes } from "routes/file.routes"

//import { config } from "../src/config/auth"


const app = express()



app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))//front

const RedisStore = connectRedis(session)

//config redis client
const redisClient = redis.createClient({
    legacyMode: true,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    },

})

redisClient.on("error", (err) => {
    console.log(`Could not establish  a connection with redis. ${err}`)
})
redisClient.on("connect", (err) => {
    console.log("Connected to redis!")
})
redisClient.connect()

//config session middleware

app.use(session({
    store: new RedisStore({ client: redisClient as any }),
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, //true so transmite o cookie via https
        httpOnly: false, //true nao deixa o client ler o cookie
        maxAge: 1000 * 60 * 10 //10 min
    }
}))

// app.use(auth(config))

app.use("/accounts", accountRoutes)
app.use("/file", fileRoutes)

app.use(["/accounts/user/file/:id", "/accounts/user/files"], express.static(`${upload.tmpFolder}/**/**`))
//toda vez que uma rota /file for chamada
//vai acessar a pasta tmp/

app.use(errorHandler)//middleware de errors


export { app }