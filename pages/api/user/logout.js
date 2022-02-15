const { serialize } = require("cookie");

export default async (req,res)=>{
    // remove cookies from request header
    res.setHeader("Set-Cookie", [
      serialize("userToken", "", {
        // kill cookie
        maxAge: -1,
        path: "/",
      }),
    ]);
    res.json({msg:"success"})
  }

  