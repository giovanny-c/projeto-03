
import { inject, injectable } from "tsyringe";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";
import { v4 as uuidV4 } from "uuid"
import { AppError } from "../../../../shared/errors/AppError";
import { validatePassword } from "../../../../../utils/password/passwordUtils";
import issueJWT from "../../../../../utils/tokensUtils/issueJWT";
import { PRIV_KEY } from "../../../../../utils/keyUtils/readKeys";




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
        private dateProvider: IDateProvider
    ) {

    }

    async execute(email: string, password: string): Promise<IResponse> {

        const user = await this.usersRepository.findByEmail(email)


        if (!user) {
            throw new AppError("email or password incorrect")
        }


        //const passwordMatch = await compare(password, user.password)

        if (!validatePassword(password, user.salt, user.password_hash)) {
            throw new AppError("email or password incorrect")
        }


        await this.usersRepository.markUserAsLogged(user.id as string)

        //deleta todos os tokens de outros logins
        await this.usersTokensRepository.deleteByUserId(user.id as string)

        //pega a chave privada e decofica em utf-8


        //bearer token/ id token
        const token = issueJWT({ payload: email, subject: user.id, key: PRIV_KEY, expiresIn: process.env.EXPIRES_IN_TOKEN as string })

        //refresh token 
        const refresh_token = uuidV4()// pode ser uuid?
        console.log(refresh_token)
        const token_family = uuidV4()//cria a familia do refresh token
        const refresh_token_expires_date = this.dateProvider.addOrSubtractTime("add", "day", Number(process.env.EXPIRES_REFRESH_TOKEN_DAYS))

        await this.usersTokensRepository.create({
            token: refresh_token,
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
            token: `Bearer ${token}`,
            refresh_token // nao vai retornar para o usuario
        }

        return tokenReturn

    }

}

export { AuthenticateUserUseCase }