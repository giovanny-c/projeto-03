

interface IMail {
    to: string
    subject: any
    variables: any
    path: string
}

interface IMailProvider {

    sendMail({ to, subject, variables, path }: IMail): Promise<void>

}

export { IMailProvider, IMail }