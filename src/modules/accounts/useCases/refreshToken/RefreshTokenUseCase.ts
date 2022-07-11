
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { v4 as uuidV4 } from "uuid"
import issueJWT from "../../../../../utils/tokensUtils/issueJWT";
import { PRIV_KEY } from "../../../../../utils/keyUtils/readKeys";

interface IResponse {
    token: string
    refresh_token: string
    // expires_date: Date
}

@injectable()
class RefreshTokenUseCase {

    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {

    }

    async execute(refresh_token: string): Promise<IResponse> {


        const refreshToken = await this.usersTokensRepository.findByRefreshToken(refresh_token)

        //verificar se o token existe
        if (!refreshToken) {
            throw new AppError("Token Missing. Please Log-in")
        }

        //ou esta invalido
        if (refreshToken.is_valid === false) {

            //invalida todos os tokens da mesma familia(mesmo criados posteriormente)
            await this.usersTokensRepository.setTokenFamilyAsInvalid({ token_family: refreshToken.token_family })

            throw new AppError("Conection expired (Invalid token). Please Log-in again", 400)

        }


        //se ja foi usado
        if (refreshToken.was_used === true) {
            //invalida todos os tokens da mesma familia(mesmo criados posteriormente)
            await this.usersTokensRepository.setTokenFamilyAsInvalid({ token_family: refreshToken.token_family })

            //desloga usuario (user tem que logar dnv para gerar um novo token de outra familia)
            throw new AppError("Conection expired (Invalid token). Please Log-in again. ", 400)


        }

        //se venceu
        if (this.dateProvider.compareIfBefore(refreshToken.expires_date, this.dateProvider.dateNow())) {
            //marca como usado e invalido
            this.usersTokensRepository.setTokenAsInvalidAndUsed(refreshToken.id)

            throw new AppError("Conection expired (token expired). Please Log-in again. ", 400)
        }


        const { id: user_id, email, is_logged } = await this.usersRepository.findById(refreshToken.user_id)


        //se nao cair nas exeptions
        //marcar rf token como usado e invalid
        this.usersTokensRepository.setTokenAsInvalidAndUsed(refreshToken.id)

        //se o user nao estiver marcado como logado
        if (is_logged === false) {
            throw new AppError("Conection expired (token expired). Please Log-in again. ", 400)

        }

        //cria um novo token

        const expiresIn = process.env.EXPIRES_IN_TOKEN as string
        //para mandar junto com os tokens
        const [amount,] = expiresIn.split(" ")
        const token_expires_date = this.dateProvider.addOrSubtractTime("add", "minutes", Number(amount))

        const newToken = issueJWT({ payload: email, subject: user_id, key: PRIV_KEY, expiresIn })


        //cria um novo rf
        const newRefresh_token = uuidV4()

        const refresh_token_expires_date = this.dateProvider.addOrSubtractTime("add", "day", Number(process.env.EXPIRES_REFRESH_TOKEN_DAYS))


        //e cria outro rf token da mesma familia no bd
        const newRefreshToken = await this.usersTokensRepository.create({
            token: newRefresh_token,
            expires_date: refresh_token_expires_date,
            user_id: user_id as string,
            is_valid: true,
            was_used: false,
            token_family: refreshToken.token_family //mesma familia
        })


        return {
            token: `Bearer ${newToken}`,
            // expires_date: token_expires_date,
            refresh_token: newRefreshToken.token
        }
    }


}

export { RefreshTokenUseCase }