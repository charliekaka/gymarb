const { randomBytes } = require("crypto");

export function authToken(){
    return randomBytes(64).toString("hex")
}