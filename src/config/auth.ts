

export const config = {

    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: "http://localhost:3333",
    clientID: process.env.AUTH0_CLIENT_ID,//
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL

}
