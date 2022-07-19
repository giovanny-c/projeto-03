import { genPassword } from "@utils/password/passwordUtils";
import { DayjsDateProvider } from "@shared/container/providers/dateProvider/implementations/DayjsDateProvider";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersTokensRepositoryInMemory";
import { CreateUserUseCase } from "@modules/accounts/useCases/createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { v4 as uuidV4 } from "uuid";

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

    it("Should be able to authenticate an user", async () => {


        const user: ICreateUserDTO = {
            //id: uuidV4(), already gen in the repo
            name: "test name",
            email: "test@test.com",
            is_confirmed: true,
            password: "1234"
        }

        await createUserUseCase.execute(user)

        const result = await authenticateUserUseCase.execute(
            user.email as string,
            user.password as string
        )

        expect(result).toHaveProperty("token")
        expect(result).toHaveProperty("refresh_token")
    })
})