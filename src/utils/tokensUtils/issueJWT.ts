
import { sign } from "jsonwebtoken"


interface IIssueJWTRequest {
    payload?: string
    subject: any
    jwtid?: string
    key: string
    expiresIn: string


}

export default function issueJWT({ payload, subject, key, expiresIn }: IIssueJWTRequest) {

    const token = sign({ payload }, key, {
        subject,
        expiresIn,
        algorithm: "RS256"
    })

    return token


}