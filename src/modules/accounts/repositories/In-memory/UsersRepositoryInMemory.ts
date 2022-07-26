import { ISaveUserDTO } from "../../dtos/ISaveUserDTO";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";
import { v4 as uuidV4 } from "uuid"

class UsersRepositoryInMemory implements IUsersRepository {

    users: User[] = []//inicializa o array

    async save({ id = uuidV4(), password_hash, name, email, salt, is_confirmed = false }: ISaveUserDTO): Promise<User> {
        let user

        user = new User()

        Object.assign(user, {
            id,
            name,
            email,
            password_hash,
            salt,
            is_confirmed
        })


        const index = this.users.findIndex(user => user.id === id)


        if (index !== -1) {

            if (password_hash && salt) {

                this.users[index].password_hash = password_hash
                this.users[index].salt = salt
            }

            return this.users[index]
        }


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