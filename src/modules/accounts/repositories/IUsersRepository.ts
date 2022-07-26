import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { User } from "../entities/User";

interface IUsersRepository {

    save(data: ICreateUserDTO): Promise<User>
    findById(id: string): Promise<User>
    findByEmail(email: string): Promise<User>
    markUserAsLogged(id: string): Promise<void>
    unmarkUserAsLogged(id: string): Promise<void>

}

export { IUsersRepository }

