import { inject, injectable } from "tsyringe";
import { genPassword } from "../../../../utils/passwordUtils/passwordUtils";

import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { JsonWebTokenError, JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import { PUB_KEY } from "../../../../utils/keyUtils/readKeys";
import { IRetrievePasswordRequest } from "./IRetrievePasswordDTO";

@injectable()
class RetrievePasswordUseCase {


    constructor(
        @inject("UsersRepository")
        private userRepository: IUsersRepository

    ) { }

    async execute({ password, confirmPassword, token }: IRetrievePasswordRequest): Promise<void> {

        if (password !== confirmPassword) {
            throw new AppError("Password and confirm password fields do not match", 400)
        }

        try {


            //como impedir que o token seja usado de novo?
            const { sub: user_id } = verify(token, PUB_KEY, { algorithms: ["RS256"] }) as JwtPayload

            const { salt, hash } = genPassword(password)

            await this.userRepository.save({
                id: user_id as string,
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