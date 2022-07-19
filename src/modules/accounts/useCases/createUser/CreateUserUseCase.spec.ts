import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory"
import { AppError } from "@shared/errors/AppError"
import { CreateUserUseCase } from "./CreateUserUseCase"


let usersRepositoryInMemory: UsersRepositoryInMemory
let createUserUseCase: CreateUserUseCase

describe("Create a user", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    })

    it("Should be able to create a user", async () => {

        const result = await createUserUseCase.execute({
            email: "test@email.com",
            name: "teste 123",
            password: "1234"
        })

        expect(result).toBe(undefined)

    })

    it("Should not be able to create a user with a email that was already used ", async () => {

        await createUserUseCase.execute({
            email: "test@email.com",
            name: "teste 123",
            password: "1234"
        })

        await expect(

            createUserUseCase.execute({
                email: "test@email.com",
                name: "test 321",
                password: "4321"
            })
        ).rejects.toEqual(new AppError("This email was registered already", 400))


    })

    it("Should not be able to create a user whitout a password", async () => {

        await expect(

            createUserUseCase.execute({
                email: "test@email.com",
                name: "test 321",

            })
        ).rejects.toEqual(new AppError("Please provide a valid password", 400))

        await expect(

            createUserUseCase.execute({
                email: "test@email.com",
                name: "test 321",
                password: ""
            })
        ).rejects.toEqual(new AppError("Please provide a valid password", 400))
    })
})