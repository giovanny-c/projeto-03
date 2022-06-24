
import { NextFunction, Request, Response } from "express"
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppError } from "./AppError"



export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        //com AppError

        //sem set status?
        return res.status(err.statusCode).json({ status: err.statusCode, message: err.message })

        //substituir Errors por appErrors
    }

    if (err instanceof TokenExpiredError) { //se o token tiver expirado




        return res.status(401).send({ message: "token expired (go to /refresh-token), Please Log-in again" })

        //return res.redirect("/accounst/refresh-token"); ?


    }

    if (err instanceof JsonWebTokenError) { //se for outro erro relacionado ao token




        return res.status(401).send({ message: "invalid token. Please Log-in to authenticate" })




    }

    return res.status(500).json({
        status: "error",
        message: `Internal server error - ${err.message}`
    })
}