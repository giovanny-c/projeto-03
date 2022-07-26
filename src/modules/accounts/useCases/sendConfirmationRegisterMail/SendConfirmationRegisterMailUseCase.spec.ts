import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory";
import { MailProviderInMemory } from "@shared/container/providers/mailProvider/In-Memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";
import { SendConfirmationRegisterMailUseCase } from "./SendConfirmationRegisterMailUseCase";


let usersRepositoryInMemory: UsersRepositoryInMemory
let mailProvider: MailProviderInMemory
let sendConfirmationRegisterMailUseCase: SendConfirmationRegisterMailUseCase


describe("Send a confirmation email to confirm the register of a new account", () => {


    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        mailProvider = new MailProviderInMemory()
        sendConfirmationRegisterMailUseCase = new SendConfirmationRegisterMailUseCase(usersRepositoryInMemory, mailProvider)
    })

    it("Should be able to send a mail to a new registered user's email", async () => {

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

        await sendConfirmationRegisterMailUseCase.execute({ email })

        expect(sendMail).toHaveBeenCalled()

    })

    it("Should not be able to send a mail to an unexisting user's email", async () => {

        const sendMail = jest.spyOn(mailProvider, "sendMail")

        const email = "test@email.com"
        await usersRepositoryInMemory.save({
            name: "test",
            email: email,
            password_hash: "dq2d23dj2d3j2",
            salt: "sdcsdvsdv",
            is_confirmed: false
        })

        await expect(
            sendConfirmationRegisterMailUseCase.execute({ email: "wrong@email.com" })
        ).rejects.toEqual(new AppError("User not found", 500))

    })

})