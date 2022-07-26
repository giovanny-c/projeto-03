import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO"
import { ISetTokenFamilyInvalidDTO } from "../dtos/ISetTokenFamilyInvalidDTO"
import { UsersTokens } from "../entities/UsersTokens"


interface IUsersTokensRepository {

    save(data: ICreateUserTokenDTO): Promise<UsersTokens>
    findByUserIdAndRefreshToken({ user_id, token }: ICreateUserTokenDTO): Promise<UsersTokens>
    findByRefreshToken(token: string): Promise<UsersTokens>
    deleteById(id: string): Promise<void>
    deleteByUserId(user_id: string): Promise<void>
    setTokenAsInvalidAndUsed(id: string): Promise<void>
    setTokenFamilyAsInvalid(data: ISetTokenFamilyInvalidDTO): Promise<void>

}

export { IUsersTokensRepository }