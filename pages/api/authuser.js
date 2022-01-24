const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");

const MongoURL = "mongodb://localhost:27017";

export default function handler(req,res){
    return new Promise((resolve, reject)=>{
        const user = {
            email: req.body.email,
            password: req.body.password
        };
        resolve(res.json(user))
    })
}
