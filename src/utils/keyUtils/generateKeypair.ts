const crypt = require("crypto")
const fs = require("fs")

function genKeyPair() {


    const keyPair = crypt.generateKeyPairSync("rsa", {
        modulusLength: 4096, //bits, padrao para algoritmos rsa
        publicKeyEncoding: {
            type: "pkcs1", //padrao de criptografia
            format: "pem", // formato do arquivo
        },
        privateKeyEncoding: {
            type: "pkcs1",
            format: "pem"
        }
    })

    fs.writeFileSync("../../../keys" + "/id_rsa_pub.pem", keyPair.publicKey)
    fs.writeFileSync("../../../keys" + "/id_rsa_priv.pem", keyPair.privateKey)
    //para salvar em uma pasta fora de src
}

genKeyPair()


//navegar até a pasta aonde este esse arquivo
// e digitar no terminal: node generateKeypair.ts

