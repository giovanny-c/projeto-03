import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { PUB_KEY } from "../../../utils/keyUtils/readKeys";
import axios from "axios";
import { request } from "http";




export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    //se o token tiver expirado fazer logica do refresh token
    const bearerToken = req.headers.authorization

    if (!bearerToken) {
        throw new AppError("Token missing", 400)
    }

    const [, token] = bearerToken.split(" ")

    //req.headers.["application/x-www-form-urlencoded"]

    verify(token, PUB_KEY, { algorithms: ["RS256"] }, (err, decoded: string | JwtPayload) => {

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
            id: decoded.sub as string
        }


        next()
    })


}