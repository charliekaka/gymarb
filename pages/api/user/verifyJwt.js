const { verify } = require("jsonwebtoken");

export function getCookie(ctx){
    try{
        const jwtToken = ctx.req?.cookies?.userToken
        if(jwtToken){
            return verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);
        }
    }catch(e){
        console.error(e)
    }
}