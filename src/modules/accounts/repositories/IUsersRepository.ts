import { ISaveUserDTO } from "../dtos/ISaveUserDTO";
import { User } from "../entities/User";

interface IUsersRepository {

    save(data: ISaveUserDTO): Promise<User>
    findById(id: string): Promise<User>
    findByEmail(email: string): Promise<User>
    markUserAsLogged(id: string): Promise<void>
    unmarkUserAsLogged(id: string): Promise<void>

}

export { IUsersRepository }

