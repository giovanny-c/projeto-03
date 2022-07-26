import { Repository } from "typeorm";
import { dataSource } from "../../../../database";
import { ISaveUserTokenDTO } from "../../dtos/ISaveUserTokenDTO";
import { ISetTokenFamilyInvalidDTO } from "../../dtos/ISetTokenFamilyInvalidDTO";
import { UsersTokens } from "../../entities/UsersTokens";
import { IUsersTokensRepository } from "../IUsersTokensRepository";

class UsersTokensRepository implements IUsersTokensRepository {

    private repository: Repository<UsersTokens>

    constructor() {
        this.repository = dataSource.getRepository(UsersTokens)
    }


    async save({ expires_date, token, user_id, is_valid, was_used, token_family }: ISaveUserTokenDTO): Promise<UsersTokens> {
        const userToken = this.repository.create({
            expires_date,
            token,
            user_id,
            is_valid,
            was_used,
            token_family
        })

        await this.repository.save(userToken)

        return userToken
    }
    async findByUserIdAndRefreshToken({ user_id, token }: ISaveUserTokenDTO): Promise<UsersTokens> {

        const userToken = await this.repository.findOne({
            where: { user_id, token }
        })

        return userToken as UsersTokens
    }

    async findByRefreshToken(token: string): Promise<UsersTokens> {

        const userToken = await this.repository.findOne({ where: { token } })

        return userToken as UsersTokens

    }
    async deleteById(id: string): Promise<void> {
        await this.repository.delete(id)
    }

    async deleteByUserId(user_id: string): Promise<void> {
        await this.repository.delete({ user_id })
    }

    async setTokenAsInvalidAndUsed(id: string): Promise<void> {

        const token = this.repository.create({
            id,
            is_valid: false,
            was_used: true
        })

        await this.repository.save(token)
    }

    async setTokenFamilyAsInvalid({ token_family, user_id }: ISetTokenFamilyInvalidDTO): Promise<void> {

        const tokens = await this.repository.find({
            where: [

                { token_family },

                { user_id }
            ]
        })





        tokens.forEach(token => {
            token.is_valid = false
        });

        console.log(tokens)

        await this.repository.save(tokens)
    }

}

export { UsersTokensRepository }