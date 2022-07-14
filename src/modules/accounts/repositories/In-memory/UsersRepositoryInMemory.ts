import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

class UsersRepositoryInMemory implements IUsersRepository {

    users: User[] = []//inicializa o array

    async create({ id, password_hash, name, email, salt, is_confirmed = false }: ICreateUserDTO): Promise<User> {

        const user = new User()

        Object.assign(user, {
            id,
            name,
            email,
            password_hash,
            salt,
            is_confirmed
        })

        this.users.push(user)

        return user
    }
    async findById(id: string): Promise<User> {

        const user = this.users.find(user => user.id === id) as User

        return user
    }
    async findByEmail(email: string): Promise<User> {
        const user = this.users.find(user => user.email === email) as User

        return user
    }
    async markUserAsLogged(id: string): Promise<void> {

        const user = new User()

        Object.assign(user, {
            id,
            is_confirmed: true
        })

        this.users.push(user)
    }
    async unmarkUserAsLogged(id: string): Promise<void> {
        const user = new User()

        Object.assign(user, {
            id,
            is_confirmed: true
        })

        this.users.push(user)
    }

}

export { UsersRepositoryInMemory }