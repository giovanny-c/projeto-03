import { inject, injectable } from "tsyringe"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { PDFDocument } from "pdf-lib"



@injectable()
class ReadPdfUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {

    }

    async execute(pdf_file) {

        PDFDocument.load(pdf_file)

    }



}

export { ReadPdfUseCase }