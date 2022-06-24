import { inject, injectable } from "tsyringe";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { hash } from "bcryptjs";
import { AppError } from "../../../../shared/errors/AppError";

@injectable()
class CreateUserUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

    ) {

    }


    async execute({ name, email, password }: ICreateUserDTO): Promise<void> {
        //pegar os dados por form no front (multer e erc)
        //hash de senha 
        try {
            const UserExists = await this.usersRepository.findByEmail(email as string)

            if (UserExists) {
                throw new AppError("This user already exists")//fazer middleware de error
            }

            const passwordHash = await hash(password as string, 8)

            await this.usersRepository.create({ name, email, password: passwordHash })

        } catch (error) {
            throw new AppError("There was not possible to create a user, please try again. If the error persists contact the suport", 500)
        }




    }

}

export { CreateUserUseCase }