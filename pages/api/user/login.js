require("dotenv").config()

const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { serialize } = require("cookie");

const MongoURL = "mongodb://localhost:27017";

export default function handler(req,res){
    return new Promise((resolve, reject)=>{
        // ensure http method
        if(req.method !== "POST") reject("invalid method / endpoint");
        // get user entered data
        const user = {
            username: req.body.username,
            password: req.body.password
        };
        // open db connection
        MongoClient.connect(MongoURL, (err, db)=>{
            if(err){
                console.log(err);
                res.status(500);
                return;
            }
            // root db
            const root = db.db("gymarb");
            // specifies user collection
            const listings = root.collection("users");
            // check if username is in db
            listings.findOne({username:user.username}, (err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500);
                    return;
                }
                // if no username is found
                if(result === null){
                    res.status(401).json({msg:"wrong username or password"})
                    resolve();
                    db.close();
                    return;
                }else{
                    // compare entered pwd to hash
                    if(bcrypt.compareSync(user.password, result.password)){
                        // object passed to jwt
                        const jwtUser = result;
                        // removes unwanted stuff from obj
                        delete jwtUser.password;
                        delete jwtUser._id;
                        // create access token
                        const accessToken = sign(
                            {
                                exp: Math.floor(Date.now() / 1000 + 60*60*24*30), //30days
                                user:jwtUser
                            },
                            process.env.ACCESS_TOKEN_SECRET
                        );
                        // create cookie
                        const cookie = serialize("userToken", accessToken, {
                            httpOnly: true,
                            // true if production
                            secure: process.env.NODE_ENV !=="development",
                            sameSite:"strict",
                            maxAge:60*60*24*30, //30days
                            path:"/"
                        })
                        // send cookie header
                        res.setHeader("Set-Cookie", cookie);
                        res.status(200).json({msg:"success"});
                        resolve();
                        db.close();
                        return;
                    }else{
                        res.status(401).json({msg:"wrong username or password"})
                        resolve();
                        db.close();
                        return;
                    }
                }
            })
        })
    })
}
