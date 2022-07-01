import { inject, injectable } from "tsyringe";
import { IPdfProvider } from "../../../../shared/container/providers/pdfProvider/IPdfProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";


@injectable()
class GeneratePdfUseCase {


    constructor(
        @inject("PdfLibProvider")
        private pdfProvider: IPdfProvider,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {

    }


    async execute(content: Object, user_id: string) {

        const user = await this.usersRepository.findById(user_id)

        if (!user) {
            throw new AppError("No user provided")
        }

        const data = [
            user.name,
            user.email,
            Object.values(content).toString()

        ]

        this.pdfProvider.ConvertToPdfFile(data, true)
    }
}
export { GeneratePdfUseCase }