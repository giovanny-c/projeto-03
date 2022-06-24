
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";

interface IResponse {
    token: string
    refresh_token: string
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
        console.log("refresh")

        const refreshToken = await this.usersTokensRepository.findByRefreshToken(refresh_token)

        const { id: user_id, email, is_logged } = await this.usersRepository.findById(refreshToken.user_id)

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


        //se nao cair nas exeptions
        //marcar rf token como usado e invalid
        this.usersTokensRepository.setTokenAsInvalidAndUsed(refreshToken.id)

        //se o user nao estiver marcado como logado
        if (is_logged === false) {
            throw new AppError("Conection expired (token expired). Please Log-in again. ", 400)

        }

        //cria um novo token
        const newToken = sign({ email }, process.env.SECRET_TOKEN as string, {
            subject: user_id,
            expiresIn: process.env.EXPIRES_IN_TOKEN as string
        })

        //cria um novo rf
        const newRefreshToken = sign({}, process.env.SECRET_REFRESH_TOKEN as string, {
            subject: user_id, // com o mesmo user id
            expiresIn: process.env.EXPIRES_IN_REFRESH_TOKEN as string
        })

        //nova data de expiração
        const newRefreshTokenExpiresDate = this.dateProvider.addOrSubtractTime("add", "day", Number(process.env.EXPIRES_REFRESH_TOKEN_DAYS))

        //e cria outro rf token da mesma familia no bd
        await this.usersTokensRepository.create({
            refresh_token: newRefreshToken,
            expires_date: newRefreshTokenExpiresDate,
            user_id: user_id as string,
            is_valid: true,
            was_used: false,
            token_family: refreshToken.token_family //mesma familia
        })




        return {
            token: newToken,
            refresh_token: newRefreshToken
        }
    }


}

export { RefreshTokenUseCase }