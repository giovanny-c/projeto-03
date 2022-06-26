import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import VerifyJWT from "../../../utils/tokens/verifyJWT";
import * as fs from "fs"
import { AppError } from "../errors/AppError";



export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    //se o token tiver expirado fazer logica do refresh token
    const bearerToken = req.headers.authorization

    if (!bearerToken) {
        throw new AppError("Token missing", 400)
    }

    const [, token] = bearerToken.split(" ")

    const PUB_KEY = fs.readFileSync("../../../../../keys/id_rsa_pub.pem", "utf-8")

    VerifyJWT(token, PUB_KEY, (err, decoded: string | JwtPayload) => {

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