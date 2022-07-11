
import { sign } from "jsonwebtoken"


interface IIssueJWTRequest {
    payload?: string
    subject: any
    jwtid: string
    key: string
    expiresIn: string


}

export default function issueJWT({ payload, subject, jwtid, key, expiresIn }: IIssueJWTRequest) {

    const token = sign({ payload }, key, {
        subject,
        jwtid,
        expiresIn,
        algorithm: "RS256"
    })

    return token


}