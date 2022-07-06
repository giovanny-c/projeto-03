

import Router from "express"
import axios from "axios"


const steam_api = Router()


steam_api.get("/steam_api", async (req, res) => {

    // try {
    //     let apiRes = await fetch("https://jsonplaceholder.typicode.com/users")

    //     const response = await apiRes.json()

    //     return res.json(response)

    // } catch (error) {
    //     throw error
    // }
    //---------------
    //response.data
    try {
        const { data } = await axios("https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=12A1D1DE83F9932934EDD6DF2BA00463&steamid=76561198077332218")

        return res.status(200).json(data)

    } catch (error) {
        throw error
    }

})

export { steam_api } 