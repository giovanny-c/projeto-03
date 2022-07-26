import { inject, injectable } from "tsyringe";
import { getExecutionTime } from "../../../../utils/decorators/executionTime";
import { inspect } from "../../../../utils/decorators/inspect";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IGetProfileRequest, IGetProfileResponse } from "./GetProfileDTO";



@injectable()
class GetProfileUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) { }

    @inspect()
    @getExecutionTime() // modifica o execTime primeiro e depois o inspect 
    async execute({ id }: IGetProfileRequest): Promise<IGetProfileResponse> {

        if (!id) {
            throw new AppError("Id missing", 400)
        }

        const user = await this.usersRepository.findById(id)

        if (!user) {
            throw new AppError("User not found", 400)
        }



        return {
            name: user.name,
            email: user.email
        }
    }
}
export { GetProfileUseCase }