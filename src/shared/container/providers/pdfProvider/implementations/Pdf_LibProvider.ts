import { IPdfProvider } from "../IPdfProvider";
import { PDFDocument } from "pdf-lib"
import dayjs from "dayjs"
import * as fs from "fs"
import path from "path"



class Pdf_LibProvider implements IPdfProvider {

    async ConvertToPdfFile(data: string[], saveOnApp?: boolean) {

        console.log(data)

        const doc = await PDFDocument.create()

        const page = doc.addPage()

        data.forEach(text => {
            page.drawText(text, {
                size: 20,
                wordBreaks: data
            })
        });

        const pdfBytes = await doc.save()

        if (saveOnApp) {


            const savePath = path.join(__dirname, "..", "..", "..", "..", "..", "..", "tmp", "PDFs") + `/${dayjs().toDate()}.pdf`

            fs.writeFile(savePath, pdfBytes, (err) => {
                if (err) {
                    throw err
                }


            })

            //fs.writeFileSync(savePath, pdfBytes)
        }

        return pdfBytes
    }
}

export { Pdf_LibProvider }