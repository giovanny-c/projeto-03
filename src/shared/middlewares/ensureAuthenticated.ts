import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

import { AppError } from "../errors/AppError";



export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    //se o token tiver expirado fazer logica do refresh token
    const authHeader = req.headers.authorization

    //como pegar os tokens?
    // const url = `${req.protocol}://${req.headers.host}${req.originalUrl}`

    // const t = req.headers['x-access-token']//?['refresh_token']

    if (!authHeader) {
        throw new AppError("Token missing", 400)
    }

    const [, token] = authHeader.split(" ")
    //separar os tokens com espaço

    verify(token, process.env.SECRET_TOKEN as string, (err, decoded: string | JwtPayload) => {

        if (err) {

            //vai chamar o middleware de errorHandler
            throw err
        }

        req.user = {
            id: decoded.sub as string
        }


        next()
    })






}