import exp from "constants";
import { Repository } from "typeorm";
import { dataSource } from "../../../../database";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";


class UsersRepository implements IUsersRepository {

    private repository: Repository<User>

    constructor() {
        this.repository = dataSource.getRepository(User)
    }



    async markUserAsLogged(id: string): Promise<void> {
        const user = this.repository.create({
            id,
            is_logged: true

        })

        await this.repository.save(user)
    }

    async unmarkUserAsLogged(id: string): Promise<void> {
        const user = this.repository.create({
            id,
            is_logged: false

        })

        await this.repository.save(user)
    }

    async create({ id, name, email, password, is_confirmed }: ICreateUserDTO): Promise<User> {

        const user = this.repository.create({ id, name, email, password, is_confirmed })

        await this.repository.save(user)

        return user //nao retornar infos sensiveis
    }
    async findById(id: string): Promise<User> {
        const user = await this.repository.findOneBy({ id })

        return user as User
    }
    async findByEmail(email: string): Promise<User> {
        const user = await this.repository.findOneBy({ email })

        return user as User
    }


}

export { UsersRepository }