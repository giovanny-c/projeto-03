import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { PUB_KEY } from "../../../utils/keyUtils/readKeys";
import axios from "axios";


const dayjs = require("dayjs")
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault("America/Sao_Paulo")//timezone

interface IRefreshTokenResponse {
    token: string
    expires_date: Date
    refresh_token: string
}

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {

    //se o token tiver expirado fazer logica do refresh token
    let bearerToken = req.headers.authorization
    const expires_date = req.headers["expires_date"]
    const refresh_token = req.headers["refresh_token"]
    let refreshTokenResponse: IRefreshTokenResponse

    if (!bearerToken) {
        throw new AppError("Token missing", 400)
    }

    if (!expires_date) {
        throw new AppError("Unable to authenticate, please log in again")
    }

    const dateNow = dayjs.tz(dayjs().toDate())
    if (dayjs(expires_date).isBefore(dateNow)) {
        console.log(`data ${expires_date} e antes de agora: ${dateNow}`)

        try {


            const { data } = await axios({
                method: "post",
                url: "http://localhost:3333/accounts/refresh-token",
                headers: {
                    ["refresh_token"]: refresh_token as string
                }

            })
            //testar erros do request de refresh token

            refreshTokenResponse = data

            bearerToken = refreshTokenResponse.token

            console.log(refreshTokenResponse)

        } catch (error) {
            throw error
        }
    }


    let [, token] = bearerToken.split(" ")

    verify(token, PUB_KEY, { algorithms: ["RS256"] }, (err, payload: string | JwtPayload) => {

        if (err instanceof TokenExpiredError) {

            //vai chamar o middleware de errorHandler
            err.message = "token expired (go to /refresh-token), Please Log-in again"
            throw err

        }

        if (err instanceof JsonWebTokenError) {

            err.message = "invalid token. Please Log-in to authenticate"
            throw err
        }





        req.user = {
            id: payload.sub as string
        }


        next()
    })


}