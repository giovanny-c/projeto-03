
import { sign } from "jsonwebtoken"


interface IIssueJWTRequest {
    payload?: string
    subject: any
    key: string
    expiresIn: string

}

export default function issueJWT({ payload, subject, key, expiresIn }: IIssueJWTRequest) {

    const token = sign({ payload }, key, {
        subject,
        expiresIn,
        algorithm: "RS256"
    })

    return `Bearer ${token}`


}