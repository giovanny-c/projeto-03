import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory"
import { AppError } from "@shared/errors/AppError"
import { PRIV_KEY } from "@utils/keyUtils/readKeys"
import { genPassword, validatePassword } from "@utils/passwordUtils/passwordUtils"
import issueJWT from "@utils/tokensUtils/issueJWT"
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase"
import { RetrievePasswordUseCase } from "./RetrievePasswordUseCase"


let usersRepository: UsersRepositoryInMemory
let retrievePasswordUseCase: RetrievePasswordUseCase


describe("Receive a token, and if it is valid, change the confirmation status of an account", () => {

    beforeEach(() => {
        usersRepository = new UsersRepositoryInMemory()
        retrievePasswordUseCase = new RetrievePasswordUseCase(usersRepository)

    })

    it("Should receive a token and update a user's password, if the token is valid", async () => {


        const user = await usersRepository.save({
            name: "test",
            email: "test@email.com",
            salt: "3d23d23d2d2d",
            password_hash: "dfs23d23d23dqd21",
            is_confirmed: true
        })

        const token = issueJWT({ subject: user.id, key: PRIV_KEY, expiresIn: process.env.EXPIRES_IN_FORGOT_PASSWORD_TOKEN as string })

        const newPass = "1234"


        await expect(retrievePasswordUseCase.execute({ password: newPass, confirmPassword: newPass, token })).resolves.toBe(undefined)

        const compareUser = await usersRepository.findById(user.id as string)

        expect(validatePassword(newPass, compareUser.salt, compareUser.password_hash)).toEqual(true)





    })

    it("Should throw an error if password and password_confirmation do not match", async () => {

        const user = await usersRepository.save({
            name: "test",
            email: "test@email.com",
            salt: "3d23d23d2d2d",
            password_hash: "dfs23d23d23dqd21",
            is_confirmed: true
        })

        const token = issueJWT({ subject: user.id, key: PRIV_KEY, expiresIn: process.env.EXPIRES_IN_FORGOT_PASSWORD_TOKEN as string })

        const newPass = "1234"


        await expect(retrievePasswordUseCase.execute({ password: newPass, confirmPassword: "4321", token })).rejects.toEqual(new AppError("Password and confirm password fields do not match", 400))



    }),

        it("Should throw an error if the token received is expired", async () => {

            const user = await usersRepository.save({
                name: "test",
                email: "test@email.com",
                salt: "3d23d23d2d2d",
                password_hash: "dfs23d23d23dqd21",
                is_confirmed: true
            })

            const token = issueJWT({ subject: user.id, key: PRIV_KEY, expiresIn: "0s" })

            const newPass = "1234"

            await expect(retrievePasswordUseCase.execute({ password: newPass, confirmPassword: newPass, token })).rejects.toThrowError(TokenExpiredError)



        })

    it("Should throw an error if the token received is invalid", async () => {
        const user = await usersRepository.save({
            name: "test",
            email: "test@email.com",
            salt: "3d23d23d2d2d",
            password_hash: "dfs23d23d23dqd21",
            is_confirmed: true
        })

        const token = issueJWT({ subject: user.id, key: PRIV_KEY, expiresIn: process.env.EXPIRES_IN_FORGOT_PASSWORD_TOKEN as string })

        const newPass = "1234"

        const invalidToken = "eyqa4f45grgre.3f33dj3jf8hf3d.f3f934f3fm3f"

        await expect(retrievePasswordUseCase.execute({ password: newPass, confirmPassword: newPass, token: invalidToken })).rejects.toThrowError(JsonWebTokenError)

    })


})