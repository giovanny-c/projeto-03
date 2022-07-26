import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory"
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersTokensRepositoryInMemory"
import { AppError } from "@shared/errors/AppError"
import { LogOutUseCase } from "./LogOutUseCase"



let usersRepositoryInMemory: UsersRepositoryInMemory
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory
let logOutUseCase: LogOutUseCase

describe("Mark a user as logged out and revoke its tokens", () => {

    beforeEach(() => {

        usersRepositoryInMemory = new UsersRepositoryInMemory()
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory()
        logOutUseCase = new LogOutUseCase(usersRepositoryInMemory, usersTokensRepositoryInMemory)
    })

    it("Shoul be able to mark a user as logged out and revoke its tokens ", async () => {

        const user_id = "21352765328787"
        await usersRepositoryInMemory.save({
            id: user_id,
            name: "test",
            email: "test@email.com",
            password_hash: "84c5gj45g49m5g45",
            salt: "sads3rfdf4343fd",
            is_confirmed: true
        })

        await usersTokensRepositoryInMemory.save({
            token: "3fd43iff34f93f",
            token_family: "d23d293dk23kd2",
            user_id: user_id,
            is_valid: true,
            was_used: false,
            expires_date: new Date()
        })



        expect(
            await logOutUseCase.execute({ user_id })
        ).toHaveReturned

    })

    it("Should not be able to mark a unexisting user as logged out", async () => {
        const user_id = "21352765328787"
        await usersRepositoryInMemory.save({
            id: user_id,
            name: "test",
            email: "test@email.com",
            password_hash: "84c5gj45g49m5g45",
            salt: "sads3rfdf4343fd",
            is_confirmed: true
        })

        await usersTokensRepositoryInMemory.save({
            token: "3fd43iff34f93f",
            token_family: "d23d293dk23kd2",
            user_id: user_id,
            is_valid: true,
            was_used: false,
            expires_date: new Date()
        })



        await expect(
            logOutUseCase.execute({ user_id: "3ze23z2d32d2f" })
        ).rejects.toEqual(new AppError("User not found", 400))
    })

})
