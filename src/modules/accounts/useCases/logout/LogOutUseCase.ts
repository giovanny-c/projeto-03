import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";




@injectable()
class LogOutUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository
    ) {

    }

    async execute(user_id: string): Promise<void> {

        await this.usersRepository.unmarkUserAsLogged(user_id)

        await this.usersTokensRepository.setTokenFamilyAsInvalid({ user_id })


        //remover o bearer token do user pelo front

    }


}

export { LogOutUseCase }