import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { PUB_KEY } from "../../../utils/keyUtils/readKeys";
import axios from "axios";


// const dayjs = require("dayjs")
// const utc = require('dayjs/plugin/utc')
// const timezone = require('dayjs/plugin/timezone')

// dayjs.extend(utc)
// dayjs.extend(timezone)
// dayjs.tz.setDefault("America/Sao_Paulo")//timezone

interface IRefreshTokenResponse {
    token: string
    refresh_token: string
}

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {

    //se o token tiver expirado fazer logica do refresh token
    const bearerToken = req.headers.authorization
    const refresh_token = req.headers["refresh_token"]

    let refreshTokenResponse: IRefreshTokenResponse

    if (!bearerToken) {
        throw new AppError("Token missing", 400)
    }

    let [, token] = bearerToken.split(" ")

    //checar se o jwt é valido para depois fazer o refresh-token
    //?fazer um verify antes de tudo com o ignoreExpiration: true?

    try {
        const { sub: user_id } = verify(token, PUB_KEY, { algorithms: ["RS256"] })

        req.user = {
            id: user_id as string
        }

    } catch (err) {
        if (err instanceof TokenExpiredError) {

            err = null

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
                console.log(refreshTokenResponse)

                let [, token] = refreshTokenResponse.token.split(" ")
                //fazer outro verify para o token novo ou passar o id do user 
                //na response de /refresh-token
                verify(token, PUB_KEY, { algorithms: ["RS256"] }, (err, payload: string | JwtPayload) => {
                    if (err) throw err

                    req.user = {
                        id: payload.sub as string
                    }


                })

                //pode se gerar inumeros refresh tokens com um token vencido se tiver o refresh-token novo

            } catch (err) {
                throw err
            }


        }

        if (err instanceof JsonWebTokenError) {
            //vai chamar o middleware de errorHandler
            err.message = "invalid token. Please Log-in to authenticate"
            throw err
        }

    }

    next()

}