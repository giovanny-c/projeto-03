//import { Session, SessionData } from "express-session"



declare namespace Express {

    // interface CustomSessionFields{
    //     user: {
    //         id: string
    //         email: string
    //     }
    // }

    export interface Request {
        user: {
            id: string
            admin?: boolean
        }
        session: Session & Partial<SessionData> & CustomSessionFields
    }



}





