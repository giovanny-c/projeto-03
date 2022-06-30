import { IPdfProvider } from "../IPdfProvider";
import { PDFDocument } from "pdf-lib"
import * as fs from "fs"
import path from "path"


class Pdf_LibProvider implements IPdfProvider {

    async ConvertToPdfFile(data: string[], saveOnApp?: boolean) {



        const doc = await PDFDocument.create()

        const page = doc.addPage()

        page.drawText(data.toString(), {
            size: 20,
            wordBreaks: data
        })

        const pdfBytes = await doc.save()

        if (saveOnApp) {


            const savePath = path.join(__dirname, "..", "..", "..", "..", "..", "..", "tmp", "PDFs")

            fs.writeFile(`${savePath}/pdf.pdf`, pdfBytes, (err) => {
                if (err) {
                    throw err
                }

                return pdfBytes
            })

        }
    }
}

export { Pdf_LibProvider }