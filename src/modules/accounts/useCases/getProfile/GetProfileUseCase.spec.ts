import { UsersRepositoryInMemory } from "@modules/accounts/repositories/In-memory/UsersRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { GetProfileUseCase } from "./GetProfileUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory
let getProfileUseCase: GetProfileUseCase


describe("Get the profile of a user, with its id", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory(),
            getProfileUseCase = new GetProfileUseCase(usersRepositoryInMemory)
    })

    it("Should be able to get a user profile", async () => {

        await usersRepositoryInMemory.save({
            id: "543234321266875",
            password_hash: "x7323crrn9832nd2fg4fwegsdh",
            salt: "dsa4f4feferff",
            name: "test testy",
            email: "test@email.com",
            is_confirmed: true
        })

        const userProfile = await getProfileUseCase.execute({ id: "543234321266875" })


        expect(userProfile).toHaveProperty("name")
        expect(userProfile).toHaveProperty("email")

    })


    it("Should not able to get a user profile whitout a id", async () => {

        await usersRepositoryInMemory.save({
            id: "543234321266875",
            password_hash: "x7323crrn9832nd2fg4fwegsdh",
            salt: "dsa4f4feferff",
            name: "test testy",
            email: "test@email.com",
            is_confirmed: true
        })

        await expect(
            getProfileUseCase.execute({ id: "" })
        ).rejects.toEqual(new AppError("Id missing", 400))


    })

    it("Should not be able to get a user profile if a unexisting id is given", async () => {

        await usersRepositoryInMemory.save({
            id: "543234321266875",
            password_hash: "x7323crrn9832nd2fg4fwegsdh",
            salt: "dsa4f4feferff",
            name: "test testy",
            email: "test@email.com",
            is_confirmed: true
        })

        await expect(
            getProfileUseCase.execute({ id: "4534534534762121" })
        ).rejects.toEqual(new AppError("User not found", 400))


    })
})