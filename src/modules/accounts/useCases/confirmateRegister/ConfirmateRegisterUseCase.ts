import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";


import { IUsersTokensRepository } from "../../../../modules/accounts/repositories/IUsersTokensRepository"
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { UsersRepository } from "../../repositories/implementations/UsersRepository";
import * as fs from "fs"



@injectable()
class ConfirmateRegisterUseCase {

    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("UsersRepository")
        private usersRepository: UsersRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {

    }

    async execute(confirmationToken: string): Promise<void> {

        try {

            const PUB_KEY = fs.readFileSync("../../../../../id_rsa_pub.pem", "utf-8")

            const user_id = verify(confirmationToken, PUB_KEY, { algorithms: ["RS256"] })
            console.log(user_id)
            const user = await this.usersRepository.findById(user_id.sub as string)

            user.is_confirmed = true

            await this.usersRepository.create(user)

        } catch (err) {
            if (err instanceof TokenExpiredError) {
                err.message = "Token expired"

                throw err
            }
            if (err instanceof JsonWebTokenError) {
                err.message = "Invalid token"

                throw err
            }
        }



    }

}

export { ConfirmateRegisterUseCase }