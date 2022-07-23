import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory"
import { PRIV_KEY } from "@utils/keyUtils/readKeys"
import { genPassword, validatePassword } from "@utils/passwordUtils/passwordUtils"
import issueJWT from "@utils/tokensUtils/issueJWT"
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


        const user = await usersRepository.create({
            name: "test",
            email: "test@email.com",
            salt: "3d23d23d2d2d",
            password_hash: "dfs23d23d23dqd21",
            is_confirmed: true
        })

        const token = issueJWT({ subject: user.id, key: PRIV_KEY, expiresIn: process.env.EXPIRES_IN_FORGOT_PASSWORD_TOKEN as string })

        const newPass = "1234"


        await expect(retrievePasswordUseCase.execute(newPass, newPass, token)).resolves.toBe(undefined)

        const compareUser = await usersRepository.findById(user.id as string)

        expect(validatePassword(newPass, compareUser.salt, compareUser.password_hash)).toEqual(true)





    })


})