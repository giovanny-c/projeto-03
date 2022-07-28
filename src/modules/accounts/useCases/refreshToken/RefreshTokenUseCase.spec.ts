import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory"
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersTokensRepositoryInMemory"
import { DayjsDateProvider } from "@shared/container/providers/dateProvider/implementations/DayjsDateProvider"
import { AppError } from "@shared/errors/AppError"
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

    it("Should receive a refresh token and if it is not expired, used or invalid, generate a new pair of tokens, and revoke the refresh-token received", async () => {

        const user = await usersRepositoryInMemory.save({
            name: "test",
            email: "test@email.com",
            password_hash: "asdadsdas",
            salt: "dsadasdas",
            is_confirmed: true
        })


        const refresh_token = await usersTokensRepositoryInMemory.save({
            expires_date: dateProvider.addOrSubtractTime("add", "hour", 1),
            user_id: user.id as string,
            token: "21312e32e32d",
            token_family: "asdaefe223r",
            is_valid: true,
            was_used: false,
        })


        const response = await refreshTokenUseCase.execute({ token: refresh_token.token })

        //generated token pair
        expect(response).toHaveProperty("token")
        expect(response.token).toMatch(/\S+\s\S+\.\S+\.\S+/) // ex: bearer sadsad.sdadsad.dasdas

        expect(response).toHaveProperty("refresh_token")
        expect(response.refresh_token).toMatch(/\S+\-\S+\-\S+\-\S+\-\S+/)// ex d32d23-3d23d23-d32d32-d23d23d23-d23d2d2

        //received refresh_token
        const received_token = await usersTokensRepositoryInMemory.findByUserIdAndRefreshToken({ user_id: user.id as string, token: refresh_token.token })
        expect(received_token).toHaveProperty("is_valid", false)
        expect(received_token).toHaveProperty("was_used", true)

        // new refresh token
        const newRefresToken = await usersTokensRepositoryInMemory.findByUserIdAndRefreshToken({ user_id: user.id as string, token: response.refresh_token as string })
        expect(newRefresToken).toHaveProperty("is_valid", true)
        expect(newRefresToken).toHaveProperty("was_used", false)
        expect(dateProvider.compareDiferenceIn(dateProvider.dateNow(), newRefresToken.expires_date, "day")).toBeGreaterThan(29)




    })

    it("Should revoke the received refresh token with a expired date, and revoke all the other tokens of the same family", async () => {

        const user = await usersRepositoryInMemory.save({
            name: "test",
            email: "test@email.com",
            password_hash: "asdadsdas",
            salt: "dsadasdas",
            is_confirmed: true
        })


        const refresh_token_1 = await usersTokensRepositoryInMemory.save({
            expires_date: dateProvider.addOrSubtractTime("sub", "hour", 1),
            user_id: user.id as string,
            token: "21312e32e32d",
            token_family: "asdaefe223r",
            is_valid: true,
            was_used: false,
        })

        const refresh_token_2 = await usersTokensRepositoryInMemory.save({
            expires_date: dateProvider.addOrSubtractTime("sub", "hour", 1),
            user_id: user.id as string,
            token: "21312e32e32d",
            token_family: "asdaefe223r",
            is_valid: true,
            was_used: false,
        })


        await expect(

            refreshTokenUseCase.execute({ token: refresh_token_2.token })

        ).rejects.toEqual(new AppError("Conection expired (token expired). Please Log-in again. ", 401))

        //if tokens got revoke
        expect(await usersTokensRepositoryInMemory.findByUserIdAndRefreshToken({ user_id: user.id as string, token: refresh_token_1.token })).toHaveProperty("is_valid", false)
        expect(await usersTokensRepositoryInMemory.findByUserIdAndRefreshToken({ user_id: user.id as string, token: refresh_token_2.token })).toHaveProperty("is_valid", false)

    })

    it("Should revoke the received refresh token with a invalid status, and revoke all the other tokens of the same family", async () => {
        const user = await usersRepositoryInMemory.save({
            name: "test",
            email: "test@email.com",
            password_hash: "asdadsdas",
            salt: "dsadasdas",
            is_confirmed: true
        })


        const refresh_token_1 = await usersTokensRepositoryInMemory.save({
            expires_date: dateProvider.addOrSubtractTime("add", "hour", 1),
            user_id: user.id as string,
            token: "21312e32e32d",
            token_family: "asdaefe223r",
            is_valid: true,
            was_used: false,
        })

        const refresh_token_2 = await usersTokensRepositoryInMemory.save({
            expires_date: dateProvider.addOrSubtractTime("add", "hour", 1),
            user_id: user.id as string,
            token: "21312e32edgfgdfg2d",
            token_family: "asdaefe223r",
            is_valid: false,
            was_used: false,
        })


        await expect(

            refreshTokenUseCase.execute({ token: refresh_token_2.token })

        ).rejects.toEqual(new AppError("Conection expired (Invalid token). Please Log-in again", 401))

        //if tokens got revoke
        expect(await usersTokensRepositoryInMemory.findByUserIdAndRefreshToken({ user_id: user.id as string, token: refresh_token_1.token })).toHaveProperty("is_valid", false)
        expect(await usersTokensRepositoryInMemory.findByUserIdAndRefreshToken({ user_id: user.id as string, token: refresh_token_2.token })).toHaveProperty("is_valid", false)
    })


    it("Should revoke the received refresh token that was already used, and revoke all the other tokens of the same family", async () => {
        const user = await usersRepositoryInMemory.save({
            name: "test",
            email: "test@email.com",
            password_hash: "asdadsdas",
            salt: "dsadasdas",
            is_confirmed: true
        })


        const refresh_token_1 = await usersTokensRepositoryInMemory.save({
            expires_date: dateProvider.addOrSubtractTime("add", "hour", 1),
            user_id: user.id as string,
            token: "21312e32e32d",
            token_family: "asdaefe223r",
            is_valid: true,
            was_used: true,
        })

        const refresh_token_2 = await usersTokensRepositoryInMemory.save({
            expires_date: dateProvider.addOrSubtractTime("add", "hour", 1),
            user_id: user.id as string,
            token: "21312e3grge32d",
            token_family: "asdaefe223r",
            is_valid: true,
            was_used: true,
        })


        await expect(

            refreshTokenUseCase.execute({ token: refresh_token_2.token })

        ).rejects.toEqual(new AppError("Conection expired (used token). Please Log-in again. ", 401))

        //if tokens got revoke
        expect(await usersTokensRepositoryInMemory.findByUserIdAndRefreshToken({ user_id: user.id as string, token: refresh_token_1.token })).toHaveProperty("is_valid", false)
        expect(await usersTokensRepositoryInMemory.findByUserIdAndRefreshToken({ user_id: user.id as string, token: refresh_token_2.token })).toHaveProperty("is_valid", false)
    })


    it("Should receive a unexisting refresh token, and throw a error", async () => {
        const user = await usersRepositoryInMemory.save({
            name: "test",
            email: "test@email.com",
            password_hash: "asdadsdas",
            salt: "dsadasdas",
            is_confirmed: true
        })

        const refresh_token = await usersTokensRepositoryInMemory.save({
            expires_date: dateProvider.addOrSubtractTime("add", "hour", 1),
            user_id: user.id as string,
            token: "21312e32e32d",
            token_family: "asdaefe223r",
            is_valid: true,
            was_used: true,
        })

        const invalid_token = "edsf4f44x3434t3433"

        await expect(

            refreshTokenUseCase.execute({ token: invalid_token })

        ).rejects.toEqual(new AppError("Token missing or invalid token, Please Log-in", 400))

    })

})