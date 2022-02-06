// creates secret for jwt and saves to ENV file
const fs = require("fs");
const {randomBytes} = require("crypto");

const foo = `ACCESS_TOKEN_SECRET=${randomBytes(64).toString("hex")}\nREFRESH_TOKEN_SECRET=${randomBytes(64).toString("hex")}`

fs.writeFile(".env", foo, (err)=>{
    if(err) console.error(err)
})