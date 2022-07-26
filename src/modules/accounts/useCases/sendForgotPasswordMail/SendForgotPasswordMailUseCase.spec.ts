import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory";
import { MailProviderInMemory } from "@shared/container/providers/mailProvider/In-Memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";


let usersRepositoryInMemory: UsersRepositoryInMemory
let mailProvider: MailProviderInMemory
let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase


describe("Send a recover password email to retrieve a password of an account", () => {


    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        mailProvider = new MailProviderInMemory()
        sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(mailProvider, usersRepositoryInMemory)
    })

    it("Should be able to send a mail to a received user's email", async () => {

        const sendMail = jest.spyOn(mailProvider, "sendMail")
        //vai tomar o lugar de mailProvider dentro do use case


        const email = "test@email.com"
        await usersRepositoryInMemory.save({
            name: "test",
            email: email,
            password_hash: "dq2d23dj2d3j2",
            salt: "sdcsdvsdv",
            is_confirmed: false
        })

        await sendForgotPasswordMailUseCase.execute({ email })

        expect(sendMail).toHaveBeenCalled()

    })

    it("Should not be able to send a mail to a received user's email if the email does not exists", async () => {



        const email = "test@email.com"
        await usersRepositoryInMemory.save({
            name: "test",
            email: email,
            password_hash: "dq2d23dj2d3j2",
            salt: "sdcsdvsdv",
            is_confirmed: false
        })

        await expect(
            sendForgotPasswordMailUseCase.execute({ email: "wrong@email.com" })
        ).rejects.toEqual(new AppError("Invalid Email, try again", 418))

    })

})