import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";
import { v4 as uuidV4 } from "uuid"
import { AppError } from "../../../../shared/errors/AppError";

interface IResponse {
    user: {
        email: string
    }
    token: string
    refresh_token: string

}

@injectable()
class AuthenticateUserUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private DateProvider: IDateProvider
    ) {

    }

    async execute(email: string, password: string): Promise<IResponse> {

        const user = await this.usersRepository.findByEmail(email)


        if (!user) {
            throw new AppError("email or password incorrect")
        }

        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) {
            throw new AppError("email or password incorrect")
        }


        await this.usersRepository.markUserAsLogged(user.id as string)

        //deleta todos os tokens de outros logins
        await this.usersTokensRepository.deleteByUserId(user.id as string)

        //bearer token/ id token
        const token = sign({ email }, process.env.SECRET_TOKEN as string, {
            subject: user.id,
            expiresIn: process.env.EXPIRES_IN_TOKEN as string
        })

        //refresh token
        const refresh_token = sign({}, process.env.SECRET_REFRESH_TOKEN as string, {
            subject: user.id,
            expiresIn: process.env.EXPIRES_IN_REFRESH_TOKEN as string
        })

        //cria a familia do refresh token
        const token_family = uuidV4()

        const refresh_token_expires_date = this.DateProvider.addOrSubtractTime("add", "day", Number(process.env.EXPIRES_REFRESH_TOKEN_DAYS))

        await this.usersTokensRepository.create({
            refresh_token: refresh_token,
            expires_date: refresh_token_expires_date, //30d
            user_id: user.id as string,
            is_valid: true,
            was_used: false,
            token_family
        })


        const tokenReturn: IResponse = {

            user: {
                email
            },
            token,
            refresh_token
        }

        return tokenReturn

    }

}

export { AuthenticateUserUseCase }