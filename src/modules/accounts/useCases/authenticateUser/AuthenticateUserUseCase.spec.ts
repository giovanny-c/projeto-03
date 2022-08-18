
import { DayjsDateProvider } from "@shared/container/providers/dateProvider/implementations/DayjsDateProvider";
import { ISaveUserDTO } from "@modules/accounts/dtos/ISaveUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersTokensRepositoryInMemory";
import { CreateUserUseCase } from "@modules/accounts/useCases/createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

import { AppError } from "@shared/errors/AppError";

let authenticateUserUseCase: AuthenticateUserUseCase
let usersRepositoryInMemory: UsersRepositoryInMemory
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory
let dateProvider: DayjsDateProvider
let createUserUseCase: CreateUserUseCase

describe("Authenticate a User", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory()
        dateProvider = new DayjsDateProvider()
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory, usersTokensRepositoryInMemory, dateProvider)
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)

    })

    //fezer test pra session

    it("Should be able to authenticate an user", async () => {


        const user: ISaveUserDTO = {
            //id: uuidV4(), already gen in the repo
            name: "test name",
            email: "test@test.com",
            is_confirmed: true,
            password: "1234"
        }

        const savedUser = await createUserUseCase.execute(user)

        const result = await authenticateUserUseCase.execute({
            email: user.email as string,
            password: user.password as string
        })

        expect(result).toHaveProperty("user")
        expect(result.user).toHaveProperty("id")

        if (process.env.SESSION_TYPE === "JWT") {

            expect(result).toHaveProperty("token")
            expect(result).toHaveProperty("refresh_token")
        }
    })

    it("Should not be able to authenticate a non-existent user", async () => {
        await expect(
            authenticateUserUseCase.execute({
                email: "false@email.com",
                password: "1234"
            })
        ).rejects.toEqual(new AppError("email or password incorrect"))
    })

    it("Should not be able to authenticate a user with a incorrect password", async () => {

        const user: ISaveUserDTO = {

            name: "test name",
            email: "test@test.com",
            is_confirmed: true,
            password: "1234"
        }

        await createUserUseCase.execute(user)

        await expect(

            authenticateUserUseCase.execute({
                email: user.email as string,
                password: "4321"
            })
        ).rejects.toEqual(new AppError("email or password incorrect"))

    })
})