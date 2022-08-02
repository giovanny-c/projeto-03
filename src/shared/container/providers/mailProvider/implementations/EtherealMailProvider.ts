import { injectable } from "tsyringe";
import * as nodemailer from "nodemailer"
import { Transporter } from "nodemailer";
import { IMail, IMailProvider } from "../IMailProvider";

import * as handlebars from "handlebars"
import * as fs from "fs"

@injectable()
class EtherealMailProvider implements IMailProvider {

    private client: Transporter

    constructor() {
        nodemailer.createTestAccount().then(account => { //criando um smtp transporter object
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                },

            })

            this.client = transporter
        }).catch(err => console.error(err))
    }

    async sendMail({ to, subject, variables, path }: IMail): Promise<void> {

        //vai ler o arquivo e transformar em string utf-8
        const templateFileContent = fs.readFileSync(path).toString("utf-8")

        //fazer a leitrura do arquivo para o handlebars entender
        const templateParse = handlebars.compile(templateFileContent)

        //vai passar as variaveis para o template
        const templateHTML = templateParse(variables)

        const message = await this.client.sendMail({
            to,
            from: "Rentalx <noreply@rentalx.com.br>",
            subject,
            html: templateHTML
        })

        console.log('Message sent: %s', message.messageId)
        //id da mensagem
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message))
        //url para verificar o que esta sendo enviado
    }


}
export { EtherealMailProvider } 