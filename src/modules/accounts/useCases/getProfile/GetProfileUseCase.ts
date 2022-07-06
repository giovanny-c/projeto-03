import { inject, injectable } from "tsyringe";
import { getExecutionTime } from "../../../../../utils/decorators/executionTime";
import { inspect } from "../../../../../utils/decorators/inspect";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface UserResponse {
    name: string
    email: string

}

@injectable()
class GetProfileUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) { }

    @inspect()
    @getExecutionTime() // modifica o execTime primeiro e depois o inspect 
    async execute(id: string): Promise<UserResponse> {

        const user = await this.usersRepository.findById(id)



        return {
            name: user.name,
            email: user.email
        }
    }
}
export { GetProfileUseCase }