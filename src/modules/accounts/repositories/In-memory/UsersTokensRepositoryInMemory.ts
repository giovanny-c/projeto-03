
import { ISaveUserTokenDTO } from "../../dtos/ISaveUserTokenDTO";
import { ISetTokenFamilyInvalidDTO } from "../../dtos/ISetTokenFamilyInvalidDTO";
import { UsersTokens } from "../../entities/UsersTokens";
import { IUsersTokensRepository } from "../IUsersTokensRepository";


class UsersTokensRepositoryInMemory implements IUsersTokensRepository {

    usersTokens: UsersTokens[] = []

    async save({ user_id, expires_date, token, token_family, is_valid = true, was_used = false }: ISaveUserTokenDTO): Promise<UsersTokens> {

        const userToken = new UsersTokens()

        Object.assign(userToken, {
            expires_date,
            user_id,
            token,
            token_family,
            is_valid,
            was_used,
        })

        this.usersTokens.push(userToken)

        return userToken

    }
    async findByUserIdAndRefreshToken({ user_id, token }: ISaveUserTokenDTO): Promise<UsersTokens> {
        const userToken = this.usersTokens.find(ut => ut.user_id === user_id && ut.token === token) as UsersTokens

        return userToken
    }
    async findByRefreshToken(token: string): Promise<UsersTokens> {
        const userToken = this.usersTokens.find(ut => ut.token === token) as UsersTokens

        return userToken
    }
    async deleteById(id: string): Promise<void> {
        const userToken = this.usersTokens.find(ut => ut.id === id) as UsersTokens

        this.usersTokens.splice(
            this.usersTokens.indexOf(userToken)
        )
    }
    async deleteByUserId(user_id: string): Promise<void> {
        const userToken = this.usersTokens.find(ut => ut.user_id === user_id) as UsersTokens

        this.usersTokens.splice(
            this.usersTokens.indexOf(userToken)
        )
    }
    async setTokenAsInvalidAndUsed(id: string): Promise<void> {
        const index = this.usersTokens.findIndex(token => token.id === id)

        this.usersTokens[index].is_valid = false
        this.usersTokens[index].was_used = true

    }
    async setTokenFamilyAsInvalid({ token_family, user_id }: ISetTokenFamilyInvalidDTO): Promise<void> {


        this.usersTokens.forEach(token => {

            if (token.token_family === token_family) {

                token.is_valid = false

            }

        });



    }

}

export { UsersTokensRepositoryInMemory }