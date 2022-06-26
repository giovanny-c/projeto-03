import { JwtPayload, verify } from "jsonwebtoken";


export default function VerifyJWT(token: string, key: string, callback: CallableFunction) {

    return verify(token, key, { algorithms: ["RS256"] }, callback())


}