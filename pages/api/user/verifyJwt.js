const { verify } = require("jsonwebtoken");

export function getCookie(ctx){
    try{
        const { cookies } = ctx.req;
        if(cookies.userToken){
            return verify(cookies.userToken, process.env.ACCESS_TOKEN_SECRET);
        }
    }catch(e){
        return
    }
}