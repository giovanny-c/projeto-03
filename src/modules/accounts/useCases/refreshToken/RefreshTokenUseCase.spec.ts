import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory"
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersTokensRepositoryInMemory"
import { DayjsDateProvider } from "@shared/container/providers/dateProvider/implementations/DayjsDateProvider"
import { RefreshTokenUseCase } from "./RefreshTokenUseCase"


let usersRepositoryInMemory: UsersRepositoryInMemory
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory
let dateProvider: DayjsDateProvider
let refreshTokenUseCase: RefreshTokenUseCase

describe("Receive a token, check if it is valid, and generate a new pair of tokens to send to the client", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory()
        dateProvider = new DayjsDateProvider()
        refreshTokenUseCase = new RefreshTokenUseCase(usersTokensRepositoryInMemory, usersRepositoryInMemory, dateProvider)

    })

    it("It should validate a token, and generate a new pair of tokens", async () => {

        const user = await usersRepositoryInMemory.create({
            name: "test",
            email: "test@email.com",
            password_hash: "asdadsdas",
            salt: "dsadasdas",
            is_confirmed: true
        })


        const refresh_token = await usersTokensRepositoryInMemory.create({
            expires_date: dateProvider.addOrSubtractTime("add", "hour", 1),
            user_id: user.id as string,
            token: "21312e32e32d",
            token_family: "asdaefe223r",
            is_valid: true,
            was_used: false,
        })

        const response = await refreshTokenUseCase.execute(refresh_token.token)


        expect(response).toHaveProperty("token")
        expect(response.token).toMatch(/\S+\s\S+\.\S+\.\S+/) // ex: bearer sadsad.sdadsad.dasdas

        expect(response).toHaveProperty("refresh_token")
        expect(response.refresh_token).toMatch(/\S+\-\S+\-\S+\-\S+\-\S+/)// ex d32d23-3d23d23-d32d32-d23d23d23-d23d2d2




    })

})