import { JsonWebTokenError, JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";



import { PUB_KEY } from "../../../../utils/keyUtils/readKeys";
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { IConfirmateRegisterRequest } from "./IConfirmateRegisterDTO";



@injectable()
class ConfirmateRegisterUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

    ) {

    }

    async execute({ confirmationToken }: IConfirmateRegisterRequest): Promise<void> {

        try {

            const { sub: user_id } = verify(confirmationToken, PUB_KEY, { algorithms: ["RS256"] }) as JwtPayload

            const user = await this.usersRepository.findById(user_id as string)

            user.is_confirmed = true

            await this.usersRepository.save(user)//update no is_confirmed

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

            throw err
        }



    }

}

export { ConfirmateRegisterUseCase }