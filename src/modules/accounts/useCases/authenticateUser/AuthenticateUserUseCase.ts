
import { inject, injectable } from "tsyringe";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";
import { v4 as uuidV4 } from "uuid"
import { AppError } from "../../../../shared/errors/AppError";
import { validatePassword } from "../../../../utils/passwordUtils/passwordUtils";
import issueJWT from "../../../../utils/tokensUtils/issueJWT";
import { PRIV_KEY } from "../../../../utils/keyUtils/readKeys";
import { IAuthenticationResponse } from "@modules/accounts/dtos/IAuthenticationResponseDTO";
import { IAuthenticateUserRequest } from "./AuthenticateUserDTO";






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

    async execute({ email, password }: IAuthenticateUserRequest): Promise<IAuthenticationResponse> {
        try {


            const user = await this.usersRepository.findByEmail(email)


            if (!user) {
                throw new AppError("email or password incorrect")
            }

            if (!user.is_confirmed) {
                throw new AppError("You need to confirm your account before you loggin for the first time. Please check your email for the confirmation register email", 400)
            }

            //const passwordMatch = await compare(password, user.password)

            if (!validatePassword(password, user.salt, user.password_hash)) {
                throw new AppError("email or password incorrect")
            }


            await this.usersRepository.markUserAsLogged(user.id as string)


            if (process.env.SESSION_TYPE === "JWT") {
                //deleta todos os tokens de outros logins
                //deletar ao logar ou deletar ao expirar(fazer func para isso no bd) ??? 
                await this.usersTokensRepository.deleteByUserId(user.id as string)


                //-------access-token------- 

                //manda o refresh dentro do jwt
                const token = issueJWT({ payload: email, subject: user.id, key: PRIV_KEY, expiresIn: process.env.EXPIRES_IN_TOKEN as string })

                //-----refresh token-------- 
                const refresh_token = uuidV4()// pode ser uuid?

                const token_family = uuidV4()//cria a familia do refresh token
                //para marcar todos os tokens da mesma familia como invalidos, caso algum tenha sido usado mais de uma vez
                //é necessario ???

                const refresh_token_expires_date = this.dateProvider.addOrSubtractTime("add", "day", Number(process.env.EXPIRES_REFRESH_TOKEN_DAYS))

                await this.usersTokensRepository.save({
                    token: refresh_token,
                    expires_date: refresh_token_expires_date, //30d
                    user_id: user.id as string,
                    is_valid: true,
                    was_used: false,
                    token_family,

                })

                return {
                    user: {
                        id: user.id as string,
                        email,
                        //admin: user.admin
                    },
                    token: `Bearer ${token}`,
                    //  expires_date: token_expires_date,
                    refresh_token
                }

            }

            return {
                user: {
                    id: user.id as string,
                    email: user.email as string
                    //admin: user.admin
                }
            }




        } catch (error) {
            throw error
        }

    }

}

export { AuthenticateUserUseCase }