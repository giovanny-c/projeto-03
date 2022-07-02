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


        let data: string[] = []

        const user = await this.usersRepository.findById(user_id)

        if (!user) {
            throw new AppError("No user provided", 400)
        }

        data.push(user.name, user.email)
        Object.keys(content).forEach(key => {

            data.push(content[key.valueOf()].toString())

        })

        this.pdfProvider.CreatePdf(data, true)
    }
}
export { GeneratePdfUseCase }