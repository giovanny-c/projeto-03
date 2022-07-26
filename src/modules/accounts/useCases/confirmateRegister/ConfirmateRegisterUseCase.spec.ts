import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory";
import { PRIV_KEY, PUB_KEY } from "@utils/keyUtils/readKeys";
import issueJWT from "@utils/tokensUtils/issueJWT";
import { JsonWebTokenError, JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import { ConfirmateRegisterUseCase } from "./ConfirmateRegisterUseCase";


let usersRepository: UsersRepositoryInMemory
let confirmateRegisterUseCase: ConfirmateRegisterUseCase


describe("Receive a token, and if it is valid, change the confirmation status of an account", () => {

    beforeEach(() => {
        usersRepository = new UsersRepositoryInMemory()
        confirmateRegisterUseCase = new ConfirmateRegisterUseCase(usersRepository)
    })

    it("Should validate de received token and change the confirmation status of a account", async () => {

        const user = await usersRepository.save({
            name: "test",
            email: "test@email.com",
            salt: "3d23d23d2d2d",
            password_hash: "dfs23d23d23dqd21",
            is_confirmed: false
        })

        const confirmationToken = issueJWT({ subject: user.id, key: PRIV_KEY, expiresIn: process.env.EXPIRES_IN_CONFIRAMTION_TOKEN as string })

        await confirmateRegisterUseCase.execute({ confirmationToken })

        const expUser = await usersRepository.findById(user.id as string)

        expect(expUser).toHaveProperty("is_confirmed", true)

    })

    it("Should throw an error if the token received is expired", async () => {
        const user = await usersRepository.save({
            name: "test",
            email: "test@email.com",
            salt: "3d23d23d2d2d",
            password_hash: "dfs23d23d23dqd21",
            is_confirmed: false
        })

        const confirmationToken = issueJWT({ subject: user.id, key: PRIV_KEY, expiresIn: "0s" })


        await expect(

            confirmateRegisterUseCase.execute({ confirmationToken })
        ).rejects.toThrowError(TokenExpiredError)


    })

    it("Should throw an error if the token received is invalid", async () => {
        const user = await usersRepository.save({
            name: "test",
            email: "test@email.com",
            salt: "3d23d23d2d2d",
            password_hash: "dfs23d23d23dqd21",
            is_confirmed: false
        })

        const confirmationToken = issueJWT({ subject: user.id, key: PRIV_KEY, expiresIn: "10m" })


        await expect(

            confirmateRegisterUseCase.execute({ confirmationToken: "eyfw232d323.3d23d23dshhedfref.45cv45fg45f4c345f34f34" })
        ).rejects.toThrowError(JsonWebTokenError)


    })


})