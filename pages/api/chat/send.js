const MongoClient = require("mongodb").MongoClient;

const MongoURL = "mongodb://localhost:27017";

export default async function handler(req,res){
    return new Promise((resolve, reject)=>{
        if(req.method !== "POST") reject("invalid method / endpoint");

        res.json({msg:"succ"})
    })
}