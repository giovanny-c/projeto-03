import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { PUB_KEY } from "../../../utils/keyUtils/readKeys";
import axios from "axios";


interface IRefreshTokenResponse {
    token: string
    refresh_token: string
}

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {


    const bearerToken = req.headers.authorization
    const refresh_token = req.headers["refresh_token"]

    let refreshTokenResponse: IRefreshTokenResponse

    if (!bearerToken) {
        throw new AppError("Token missing", 400)
    }

    let [, token] = bearerToken.split(" ") //separa as partes do token


    try {
        const payload = verify(token, PUB_KEY, { algorithms: ["RS256"] })
        console.log(payload)

        req.user = {//nao seta se o token expirar
            id: payload.sub as string
        }

    } catch (err) {
        if (err instanceof TokenExpiredError) { //se o token expirar

            err = null // nao lança o erro

            try {//logica de refresh token


                const { data } = await axios({//chamando a rota de refresh
                    method: "post",
                    url: "http://localhost:3333/accounts/refresh-token",
                    headers: {
                        ["refresh_token"]: refresh_token as string
                    }
                    //testar erros do request de refresh token
                    //quando manda um token antigo da: erro 400 request failed
                    //que estao no bd
                })


                refreshTokenResponse = data
                console.log(refreshTokenResponse) //para pegar o token e rf manualmente, excluir depois de fazer o front

                let [, token] = refreshTokenResponse.token.split(" ")

                // ??? fazer outro verify para o token novo ou passar o id do user 
                //na response de /refresh-token ???
                verify(token, PUB_KEY, { algorithms: ["RS256"] }, (err, payload: string | JwtPayload) => {
                    if (err) throw err

                    req.user = {
                        id: payload.sub as string
                    }


                })

                //pode se gerar inumeros refresh tokens 
                //com um token vencido se tiver o refresh-token novo
                //fazer uma forma de atrelar o par de token/refresh_token

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