import session from "express-session"
import * as redis from "redis"
import connectRedis from "connect-redis"

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

export default (session({
    store: new RedisStore({ client: redisClient as any }),//por que o type nao vai
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, //true so transmite o cookie via https
        httpOnly: false, //true nao deixa o client ler o cookie
        maxAge: 1000 * 60 * 10 //10 min
    }
}))



//config session middleware

