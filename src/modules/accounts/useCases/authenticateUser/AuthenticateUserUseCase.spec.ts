import { genPassword } from "../../../../utils/password/passwordUtils";
import { DayjsDateProvider } from "../../../../shared/container/providers/dateProvider/implementations/DayjsDateProvider";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "../../repositories/In-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "../../repositories/In-memory/UsersTokensRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
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

        const password = "1234"
        const { salt, hash } = genPassword(password)

        const user: ICreateUserDTO = {
            //id: uuidV4(), already gen in the repo
            name: "test name",
            email: "test@test.com",
            is_confirmed: true,
            password_hash: hash,
            salt: salt,
        }

        await createUserUseCase.execute(user)

        const result = await authenticateUserUseCase.execute(
            user.email as string,
            password
        )

        expect(result).toHaveProperty("token", "refresh_token")
    })
})