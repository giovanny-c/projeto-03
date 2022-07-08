import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { PUB_KEY } from "../../../utils/keyUtils/readKeys";


export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {


    //se o token tiver expirado fazer logica do refresh token
    const bearerToken = req.headers.authorization
    const expires_date = req.headers["expires_date"]
    const refresh_token = req.headers["refresh_token"]

    if (!bearerToken) {
        throw new AppError("Token missing", 400)
    }

    const [, token] = bearerToken.split(" ")

    //pegar o tempo de expiração que deve ser mandado junto ao token
    //comparar pra ver se ja venceu
    //se sim, pular essa verificaçao com o verify
    //e passar pelo /refresh-token



    if (!expires_date) {
        throw new AppError("Unable to authenticate, please log in again")
    }

    //fazer a comparação sem usar o provider
    // if (dayjs.compareIfBefore(dayjs.dateNow(), dayjs.convertToDate(expires_date as string))) {

    //     console.log(`a data ${expires_date} e antes de ${dayjs.dateNow()}`)

    // }



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