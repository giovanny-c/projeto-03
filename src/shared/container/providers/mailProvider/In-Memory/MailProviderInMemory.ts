import { IMail, IMailProvider } from "../IMailProvider";


class MailProviderInMemory implements IMailProvider {

    private message: any[] = []

    async sendMail({ to, subject, variables, path }: IMail): Promise<void> {
        this.message.push({
            to,
            subject,
            variables,
            path
        })
    }

}
export { MailProviderInMemory }