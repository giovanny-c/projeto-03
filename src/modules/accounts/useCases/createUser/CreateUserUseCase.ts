import { inject, injectable } from "tsyringe";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { hash } from "bcryptjs";
import { AppError } from "../../../../shared/errors/AppError";
import { genPassword } from "../../../../../utils/password/passwordUtils"


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
            const userExists = await this.usersRepository.findByEmail(email as string)

            if (userExists) {
                throw new AppError("This email was registered already", 400)//fazer middleware de error
            }

            if (!password || password === undefined) {

                throw new AppError("Please provide a valid password", 400)
            }

            const { salt, hash } = genPassword(password)

            //const passwordHash = await hash(password as string, 8)

            await this.usersRepository.create({ name, email, password_hash: hash, salt })

        } catch (error) {
            throw new AppError("There was not possible to create a user, please try again. If the error persists contact the suport", 500)
        }




    }

}

export { CreateUserUseCase }