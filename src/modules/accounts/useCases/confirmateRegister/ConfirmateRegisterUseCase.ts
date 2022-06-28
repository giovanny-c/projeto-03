import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";


import { UsersRepository } from "../../repositories/implementations/UsersRepository";
import * as fs from "fs"
import { PUB_KEY } from "../../../../../utils/keyUtils/readKeys";



@injectable()
class ConfirmateRegisterUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: UsersRepository,

    ) {

    }

    async execute(confirmationToken: string): Promise<void> {

        try {

            const user_id = verify(confirmationToken, PUB_KEY, { algorithms: ["RS256"] })

            const user = await this.usersRepository.findById(user_id.sub as string)

            user.is_confirmed = true

            await this.usersRepository.create(user)

        } catch (err) {
            if (err instanceof TokenExpiredError) {
                err.message = "Token expired"
                //deletar conta do bd?
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