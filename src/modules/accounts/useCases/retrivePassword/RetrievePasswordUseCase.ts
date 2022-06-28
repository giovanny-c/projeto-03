import { inject, injectable } from "tsyringe";
import { genPassword } from "../../../../../utils/password/passwordUtils";

import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";
import * as fs from "fs"
import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";

@injectable()
class RetrievePasswordUseCase {


    constructor(
        @inject("UsersRepository")
        private userRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private userTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) { }

    async execute(password: string, confirmPassword: string, token: string): Promise<void> {

        if (password !== confirmPassword) {
            throw new AppError("Password and confirm password fields do not match")
        }

        try {

            const PUB_KEY = fs.readFileSync("../../../../../keys/id_rsa_pub.pem", "utf-8")

            const user_id = verify(token, PUB_KEY, { algorithms: ["RS256"] })

            const { salt, hash } = genPassword(password)

            await this.userRepository.create({
                id: user_id.sub as string,
                password_hash: hash,
                salt
            })



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

export { RetrievePasswordUseCase }