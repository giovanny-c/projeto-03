import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";
import { ILogOutRequest } from "./ILogOutDTO";




@injectable()
class LogOutUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository
    ) {

    }

    async execute({ user_id }: ILogOutRequest): Promise<void> {
        try {

            const user = await this.usersRepository.findById(user_id)

            if (!user) {
                throw new AppError("User not found", 400)
            }

            await this.usersRepository.unmarkUserAsLogged(user_id)

            if (process.env.SESSION_TYPE === "JWT") {
                await this.usersTokensRepository.setTokenFamilyAsInvalid({ user_id })
            }

        } catch (error) {

            throw error
        }



        //remover o bearer token do user pelo front

    }


}

export { LogOutUseCase }