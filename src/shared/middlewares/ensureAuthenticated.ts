import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { PUB_KEY } from "../../utils/keyUtils/readKeys";
import axios from "axios";



export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {

    if (process.env.SESSION_TYPE === "JWT") {
        const bearerToken = req.headers.authorization
        const refresh_token = req.headers["refresh_token"]

        if (!bearerToken || !refresh_token) {
            throw new AppError("Token missing", 400)
        }


        try {

            let [, token] = bearerToken.split(" ") //separa as partes do token



            const { sub: user_id } = verify(token, PUB_KEY, { algorithms: ["RS256"] }) as JwtPayload

            req.user = {//nao seta se o token expirar
                id: user_id as string
            }

        } catch (err) {

            if (err instanceof TokenExpiredError) { //se o token expirar

                err = null // nao lança o erro

                try {//logica de refresh token

                    const { data } = await axios({//chamando a rota de /refresh-token
                        method: "post",
                        url: "http://localhost:3333/accounts/refresh-token",
                        headers: {
                            ["refresh_token"]: refresh_token as string
                        },

                    })


                    //para pegar o token e rf manualmente, excluir depois de fazer o front
                    console.log(data)
                    let [, token] = data.token.split(" ")


                    // ??? fazer outro verify para o token novo ou passar o id do user 
                    //na response de /refresh-token ???
                    verify(token, PUB_KEY, { algorithms: ["RS256"] }, (err, { sub: user_id }: string | JwtPayload) => {
                        if (err) throw err

                        req.user = {
                            id: user_id as string
                        }


                    })

                } catch (err) {

                    throw err // tratado pelo errorHandler

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

    if (!req.session || !req.session.user) {
        throw new AppError("Session expired please log-in again", 401)


    }

    req.user = {

        id: req.session.user.id,
        admin: req.session.user.admin || false,

    }



    next()


}