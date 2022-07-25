import * as fs from "fs"
import * as path from "path"

const priv_key_path = path.join(__dirname, "..", "..", "..", "keys", "id_rsa_priv.pem")
const pub_key_path = path.join(__dirname, "..", "..", "..", "keys", "id_rsa_pub.pem")

export const PRIV_KEY = fs.readFileSync(priv_key_path, "utf-8")
export const PUB_KEY = fs.readFileSync(pub_key_path, "utf-8")