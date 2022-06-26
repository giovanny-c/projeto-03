
import { sign } from "jsonwebtoken"


interface IIssueJWTRequest {
    payload?: string
    subject: any
    key: string
    expiresIn: string
}

export default function issueJWT({ payload, subject, key, expiresIn }: IIssueJWTRequest) {

    return sign({ payload }, key, {
        subject,
        expiresIn
    })





}